<template>
  <div class="login">
    <form @submit.prevent="onSubmit">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()
const store = useAuthStore()

async function onSubmit() {
  error.value = ''
  try {
    const resp = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username.value, password: password.value })
    })
    const data = await resp.json()
    if (data.code === 0) {
      store.setTokens(data.data.accessToken, data.data.refreshToken)
      router.push('/')
    } else {
      error.value = data.message
    }
  } catch (e) {
    error.value = e.message
  }
}
</script>
