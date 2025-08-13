<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1 class="title">CMS Admin</h1>
      <form @submit.prevent="onSubmit">
        <div class="field">
          <input v-model="username" placeholder="Username" />
        </div>
        <div class="field">
          <input v-model="password" type="password" placeholder="Password" />
        </div>
        <button type="submit" class="login-btn">Login</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
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

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #141e30 0%, #243b55 100%);
}

.login-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 40px 30px;
  width: 360px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: #fff;
}

.title {
  text-align: center;
  margin-bottom: 24px;
  font-weight: 500;
  font-size: 24px;
}

.field {
  margin-bottom: 16px;
}

.field input {
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.field input::placeholder {
  color: #e0e0e0;
}

.login-btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 6px;
  background: #4facfe;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.login-btn:hover {
  opacity: 0.9;
}

.error {
  margin-top: 12px;
  color: #ff7b7b;
  text-align: center;
  font-size: 14px;
}
</style>

