<template>
  <main style="font-family: system-ui, sans-serif; padding: 1rem; max-width: 960px; margin: 0 auto;">
    <header style="display:flex; align-items:center; gap:1rem; justify-content:space-between;">
      <div>
        <h1 style="margin:0;">Vue - Lista de Séries</h1>
        <small style="opacity:.75">API: <code>{{ API_BASE }}</code> • <a href="/api/docs" target="_blank">Swagger</a></small>
      </div>
      <div>
        <button @click="checkHealth" :disabled="healthLoading">Health</button>
        <span v-if="health">Status: <strong :style="{color: health.status==='ok'?'green':'crimson'}">{{ health.status }}</strong></span>
      </div>
    </header>

    <NavBar />

    <p v-if="error" style="color:crimson; margin-top: .5rem;">{{ error }}</p>

    <router-view style="display:block; margin-top:1rem;" />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavBar from './layouts/NavBar.vue'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

// Shared state
const error = ref('')

// Health/Seed
const health = ref(null)
const healthLoading = ref(false)
const seedLoading = ref(false)
const seedMsg = ref('')

async function checkHealth() {
  healthLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/health`)
    health.value = await res.json()
  } catch (e) {
    health.value = { status: 'erro' }
  } finally {
    healthLoading.value = false
  }
}

onMounted(() => { checkHealth() })
</script>

<style scoped>
  label { display:block; margin-top:.5rem; }
  input { padding:.4rem .5rem; margin-top:.2rem; }
  button { margin-top:.4rem; padding:.35rem .6rem; }
  ul { list-style: none; padding-left: 0; }
</style>
