<template>
  <main class="relative w-[min(1440px,100vw)] max-w-[1440px] mx-auto p-4 font-sans">

    <NavBar />

    <div class="app-content pt-[64px] max-[600px]:pt-[76px] min-[981px]:pt-4 min-[981px]:pl-[260px]">
      <header class="flex items-center justify-between gap-4">

      </header>

      <div class="mt-4">
        <p v-if="error" class="mt-2 text-crimson">{{ error }}</p>
        <router-view class="mt-4 block" />
      </div>
    </div>

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