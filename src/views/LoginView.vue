<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { ILoginCredentials, IRegisterCredentials } from '@/types'

const authStore = useAuthStore()
const loginCredentials = reactive<ILoginCredentials>({
  email: '',
  password: ''
})
const registerCredentials = reactive<IRegisterCredentials>({
  name: '',
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
const showRegister = ref(false)

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  const result = await authStore.login(loginCredentials)
  if (!result.success) {
    error.value = 'Login failed'
  }
  loading.value = false
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  const result = await authStore.register(registerCredentials)
  if (result.success) {
    error.value = 'Registration successful! Please login'
    showRegister.value = false
    registerCredentials.email = ''
    registerCredentials.password = ''
    registerCredentials.name = ''
  } else {
    error.value = 'Registration failed'
  }
  loading.value = false
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>WNote</h1>
      <p class="subtitle">Sign in to your account</p>
      
      <form v-if="!showRegister" @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="loginCredentials.email"
            type="email"
            class="input"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="loginCredentials.password"
            type="password"
            class="input"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <div class="register-link">
          Don't have an account? 
          <a href="#" @click.prevent="showRegister = true">Register here</a>
        </div>
      </form>
      
      <form v-else @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            v-model="registerCredentials.name"
            type="text"
            class="input"
            placeholder="Enter your name"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="register-email">Email</label>
          <input
            id="register-email"
            v-model="registerCredentials.email"
            type="email"
            class="input"
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="register-password">Password</label>
          <input
            id="register-password"
            v-model="registerCredentials.password"
            type="password"
            class="input"
            placeholder="Enter your password"
            required
          />
        </div>
        
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
        
        <button type="button" class="btn btn-secondary" @click="showRegister = false">
          Back to Login
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-secondary);
  padding: 20px;
}

.login-card {
  background: var(--color-white);
  border-radius: var(--radius);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: var(--shadow);
}

h1 {
  color: var(--color-primary);
  text-align: center;
  margin-bottom: 10px;
}

.subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
}

.login-form .btn,
.register-form .btn {
  width: 100%;
  margin-bottom: 15px;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 10px;
  border-radius: var(--radius);
  margin: 15px 0;
  text-align: center;
}

.register-link {
  text-align: center;
  margin-top: 20px;
  color: var(--color-text-light);
}

.register-link a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.register-link a:hover {
  text-decoration: underline;
}
</style>