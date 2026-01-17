import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'
import type { ILoginCredentials, IRegisterCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const token = ref<string>(localStorage.getItem('token') || '')
    const isAuthenticated = computed(() => !!token.value)

    const login = async (credentials: ILoginCredentials) => {
        try {
            const response = await axios.post('/auth/login', credentials)
            token.value = response.data.access_token
            localStorage.setItem('token', token.value)
            router.push({ name: 'Home' })
            return { success: true }
        } catch (er) {
            return { success: false, message: 'Invalid credentials' }
        }
    }

    const register = async (credentials: IRegisterCredentials) => {
        try {
            await axios.post('/auth/register', credentials)
            return { success: true }
        }
        catch (er) {
            return { success: false, message: 'Registration failed' }
        }   
    }

    const logout = () => {
        token.value = ''
        localStorage.removeItem('token')
        router.push({ name: 'Login' })
    }

    return {
        token,
        isAuthenticated,
        login,
        register,
        logout
    }
})