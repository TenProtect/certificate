<template>
  <div>
    <h1>Licenses</h1>
    <form @submit.prevent="create">
      <input v-model="form.name" placeholder="名称" />
      <input v-model="form.badge" placeholder="标识" />
      <input v-model="form.printSize" placeholder="打印尺寸" />
      <input v-model="form.pixelSize" placeholder="像素尺寸" />
      <button type="submit">新增</button>
    </form>
    <p v-if="error">{{ error }}</p>
    <ul>
      <li v-for="item in list" :key="item.id">
        {{ item.name }} - {{ item.badge }}
        <button @click="remove(item.id)">删除</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const apiBase = import.meta.env.VITE_API_BASE
const list = ref([])
const error = ref('')
const form = ref({ name: '', badge: '', printSize: '', pixelSize: '' })

async function load() {
  const resp = await fetch(`${apiBase}/api/licenses`)
  const data = await resp.json()
  if (data.code === 0) {
    list.value = data.data
  } else {
    error.value = data.message
  }
}

async function create() {
  error.value = ''
  const resp = await fetch(`${apiBase}/api/licenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  })
  const data = await resp.json()
  if (data.code === 0) {
    form.value = { name: '', badge: '', printSize: '', pixelSize: '' }
    await load()
  } else {
    error.value = data.message
  }
}

async function remove(id) {
  await fetch(`${apiBase}/api/licenses/${id}`, { method: 'DELETE' })
  await load()
}

onMounted(load)
</script>
