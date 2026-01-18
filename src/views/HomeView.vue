<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'
import type { INote } from '@/types'
import { useRouter } from 'vue-router'

const notesStore = useNotesStore()
const authStore = useAuthStore()
const router = useRouter()

const newNote = reactive<INote>({
  title: '',
  content: ''
})

const editingId = ref<string | null>(null)
const editingNote = reactive<Partial<INote>>({})

onMounted(async () => {
  await notesStore.fetchNotes()
})

const addNote = async () => {
  if (!newNote.title.trim() || !newNote.content.trim()) return
  
  const result = await notesStore.createNote({
    title: newNote.title,
    content: newNote.content
  })
  
  if (result.success) {
    newNote.title = ''
    newNote.content = ''
  }
}

const startEdit = (note: INote) => {
  editingId.value = note.id!
  editingNote.title = note.title
  editingNote.content = note.content
}

const saveEdit = async (id: string) => {
  if (editingNote.title && editingNote.content) {
    await notesStore.updateNote(id, editingNote)
    editingId.value = null
    newNote.title = ''
    newNote.content = ''
    newNote.id = ''
  }
}

const deleteNote = async (id: string) => {
  if (confirm('Are you sure you want to delete this note?')) {
    await notesStore.deleteNote(id)
  }
}

const logout = () => {
  authStore.logout()
  router.push({ name: 'login' })
}

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div class="home-container">
    <header class="header">
      <div class="header-content">
        <h1>Notes Storage:</h1>
        <button @click="logout" class="btn btn-secondary">
          Logout
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="add-note-section card">
        <h2>Add New Note</h2>
        <form @submit.prevent="addNote" class="note-form">
          <input
            v-model="newNote.title"
            type="text"
            placeholder="Note title"
            class="input"
            required
          />
          <textarea
            v-model="newNote.content"
            placeholder="Note content"
            class="input textarea"
            rows="3"
            required
          ></textarea>
          <button type="submit" class="btn btn-primary" :disabled="notesStore.loading">
            Add Note
          </button>
        </form>
      </div>

      <div class="notes-section">
        <div v-if="notesStore.loading" class="loading">
          Loading notes...
        </div>
        
        <div v-else-if="notesStore.error" class="error">
          {{ notesStore.error }}
        </div>

        <div v-else-if="notesStore.notes.length === 0" class="empty-state">
          <p>No notes yet. Create your first note!</p>
        </div>

        <div v-else class="notes-grid">
          <div 
            v-for="note in notesStore.notes" 
            :key="note.id" 
            class="note-card card"
          >
            <div class="note-header">
              <input
                v-if="note.id === editingId"
                v-model="editingNote.title"
                type="text"
                class="input edit-input"
                @keyup.enter="saveEdit(note.id!)"
              />
              <h3 v-else>{{ note.title }}</h3>
              <div class="note-actions">
                <button 
                  v-if="note.id === editingId"
                  @click="saveEdit(note.id!)"
                  class="btn-icon"
                  title="Save"
                >
                  ✓
                </button>
                <button 
                  v-else
                  @click="startEdit(note)"
                  class="btn-icon"
                  title="Edit"
                >
                  ✏️
                </button>
                <button 
                  @click="deleteNote(note.id!)"
                  class="btn-icon btn-icon-danger"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
            
            <div class="note-content">
              <textarea
                v-if="note.id === editingId"
                v-model="editingNote.content"
                class="input edit-textarea"
                @keyup.ctrl.enter="saveEdit(note.id!)"
              ></textarea>
              <p v-else>{{ note.content }}</p>
            </div>
            
            <div class="note-footer">
              <small v-if="note.updatedAt">
                {{ formatDate(note.updatedAt) }}
              </small>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: var(--color-secondary);
}

.header {
  background: var(--color-white);
  padding: 20px 0;
  box-shadow: var(--shadow);
  margin-bottom: 30px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  color: var(--color-primary);
  margin: 0;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.add-note-section {
  margin-bottom: 30px;
}

.add-note-section h2 {
  margin-bottom: 20px;
  color: var(--color-text);
}

.note-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.note-card {
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.note-card:hover {
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--color-secondary);
  padding-bottom: 10px;
}

.note-header h3 {
  margin: 0;
  flex: 1;
  color: var(--color-text);
}

.note-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.btn-icon:hover {
  opacity: 1;
}

.btn-icon-danger {
  color: #dc3545;
}

.note-content {
  flex: 1;
  margin-bottom: 15px;
  color: var(--color-text-light);
}

.note-content p {
  margin: 0;
  line-height: 1.5;
}

.edit-input {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.edit-textarea {
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  margin-bottom: 10px;
}

.note-footer {
  border-top: 1px solid var(--color-secondary);
  padding-top: 10px;
  color: var(--color-text-light);
  font-size: 12px;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 40px;
  color: var(--color-text-light);
  background: var(--color-white);
  border-radius: var(--radius);
}

.error {
  color: #dc3545;
  background-color: #fee;
}
</style>