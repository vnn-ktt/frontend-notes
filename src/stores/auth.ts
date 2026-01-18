import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import type { ILoginCredentials, IRegisterCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string>(localStorage.getItem('token') || '')
    const isAuthenticated = computed(() => !!token.value)

    const login = async (credentials: ILoginCredentials) => {
        try {
            const response = await axios.post('/auth/login', credentials)
            token.value = response.data.access_token
            localStorage.setItem('token', token.value)

            return { success: true }
        } catch (er: any) {
            return {
                success: false,
                message: er.response?.data?.message || 'Invalid credentials'
            }
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
    }

    return {
        token,
        isAuthenticated,
        login,
        register,
        logout
    }
})