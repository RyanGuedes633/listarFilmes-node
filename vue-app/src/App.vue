<template>
  <main class="relative w-[min(1440px,100vw)] max-w-[1440px] mx-auto p-4 font-sans">

    <!-- Full-screen background for unauthenticated views -->
    <div v-if="!user" class="fixed inset-0 bg-slate-200 -z-50 pointer-events-none"></div>

    <NavBar v-if="user" />

    <div
      :class="[
        'app-content transition-all duration-300',
        user
          ? 'pt-[64px] max-[600px]:pt-[76px] min-[981px]:pt-4 min-[981px]:pl-[260px]'
          : 'pt-8 flex flex-col items-center justify-center min-h-[85vh] w-full'
      ]"
    >
      <div class="mt-4 w-full">
        <p v-if="error" class="mt-2 text-crimson">{{ error }}</p>
        <router-view class="block w-full" />
      </div>
    </div>

  </main>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import NavBar from './layouts/NavBar.vue'
import { useAuth } from './stores/auth.js'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const { user } = useAuth()

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