import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { INote } from '@/types'
import * as guards from '@/types/guards'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref<INote[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const fetchNotes = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await axios.get<INote[]>('/notes')
      notes.value = response.data
    } catch (er) {
      error.value = 'Failed to fetch notes'
    } finally{
      loading.value = false
    }
  }

  const createNote = async (note: Omit<INote, 'id'>) => {
    try {
      const response = await axios.post<INote>('/notes', note)
      if (guards.isNote(response.data)) {
        notes.value.push(response.data as INote)
        return { success: true }
      } else {
        return { message: 'Bad server answer' }
      }
    } catch (er) {
     return { success: false, message: 'Failed to create note' } 
    }
  }

  const updateNote = async (id: string, note: Partial<INote>) => {
    try {
      const response = await axios.put<INote>(`/notes/${id}`, note)
      if (guards.isNote(response.data)) {
        const index = notes.value.findIndex(n => n.id === note.id)
        if (index !== -1) {
          notes.value[index] = response.data as INote
        }
        return { success: true }
      } else {
        return { message: 'Bad server answer' }
      }
    } catch (er) {
     return { success: false, message: 'Failed to update note' } 
    }
  }

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/notes/${id}`)
      notes.value = notes.value.filter(n => n.id !== id)
      return { success: true }
    } catch (er) {
     return { success: false, message: 'Failed to delete note' } 
    }
  }

  return {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote
  }
})
