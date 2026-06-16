<template>
  <div class="w-full max-w-md mx-auto bg-white border-t-4 border-t-[#015C91] rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/60 p-8 sm:p-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/80">
    
    <h1 class="text-2xl font-semibold text-slate-800 mb-1">Criar conta</h1>
    <p class="text-slate-600 mb-6">Cadastre-se para aproveitar a aplicação.</p>

    <!-- Tab Selector to alternate between login and register -->
    <div class="flex bg-slate-100 p-1 rounded-full mb-8 max-w-[200px] mx-auto border border-slate-200/50">
      <router-link
        to="/login"
        class="flex-1 text-center py-1.5 text-xs font-semibold rounded-full transition-all duration-200"
        :class="$route.name === 'login' ? 'bg-white text-[#015C91] shadow-sm font-bold' : 'text-slate-500 hover:text-[#015C91]'"
      >
        Entrar
      </router-link>
      <router-link
        to="/cadastro"
        class="flex-1 text-center py-1.5 text-xs font-semibold rounded-full transition-all duration-200"
        :class="$route.name === 'register' ? 'bg-white text-[#015C91] shadow-sm font-bold' : 'text-slate-500 hover:text-[#015C91]'"
      >
        Cadastrar
      </router-link>
    </div>

    <form @submit.prevent="onSubmit" class="space-y-5">
      <div>
        <label for="name" class="block text-sm font-medium text-slate-700 mb-1">Nome</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </span>
          <input
            id="name"
            v-model.trim="form.name"
            type="text"
            required
            autocomplete="name"
            class="w-full rounded-xl border border-slate-200/80 bg-slate-50 pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#015C91]/20 focus:border-[#015C91] focus:bg-white transition-all duration-300 text-sm shadow-sm"
            placeholder="Seu nome completo"
          />
        </div>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </span>
          <input
            id="email"
            v-model.trim="form.email"
            type="email"
            required
            autocomplete="email"
            class="w-full rounded-xl border border-slate-200/80 bg-slate-50 pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#015C91]/20 focus:border-[#015C91] focus:bg-white transition-all duration-300 text-sm shadow-sm"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div>
        <label for="password" class="block text-sm font-medium text-slate-700 mb-1">Senha</label>
        <div class="relative">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </span>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            autocomplete="new-password"
            minlength="6"
            class="w-full rounded-xl border border-slate-200/80 bg-slate-50 pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-[#015C91]/20 focus:border-[#015C91] focus:bg-white transition-all duration-300 text-sm shadow-sm"
            placeholder="Mínimo de 6 caracteres"
          />
        </div>
      </div>

      <!-- Action buttons & redirect -->
      <button
        type="submit"
        :disabled="loading"
        class="w-full mt-2 bg-[#015C91] hover:bg-[#014d7a] text-white font-semibold rounded-xl py-3 px-4 shadow-lg shadow-[#015C91]/20 hover:shadow-xl hover:shadow-[#015C91]/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none text-sm cursor-pointer"
      >
        <span class="flex items-center justify-center gap-2">
          <svg v-if="loading" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
        </span>
      </button>

      <!-- Status alerts -->
      <div v-if="error" class="bg-red-50/80 border border-red-200 text-red-700 rounded-xl p-3 text-sm flex items-start gap-2.5 mt-4 transition-all duration-300">
        <svg class="h-5 w-5 text-red-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
      </div>

      <div v-if="message" class="bg-green-50/80 border border-green-200 text-green-700 rounded-xl p-3 text-sm flex items-start gap-2.5 mt-4 transition-all duration-300">
        <svg class="h-5 w-5 text-green-500 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>{{ message }}</span>
      </div>

      <p class="text-xs text-slate-500 text-center mt-6">
        Já tem uma conta?
        <router-link to="/login" class="font-semibold text-[#015C91] hover:text-[#014d7a] hover:underline transition-colors ml-1">
          Entrar
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const router = useRouter()
const loading = ref(false)
const error = ref('')
const message = ref('')

const form = ref({
  name: '',
  email: '',
  password: '',
})

async function onSubmit() {
  error.value = ''
  message.value = ''

  if (!form.value.name || !form.value.email || !form.value.password) {
    error.value = 'Preencha todos os campos.'
    return
  }

  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
      }),
    })

    const data = await safeJson(res)
    if (!res.ok) {
      throw new Error(data?.message || 'Falha ao cadastrar')
    }

    message.value = 'Cadastro realizado com sucesso!'
    // Redireciona para login após breve atraso
    setTimeout(() => router.push({ name: 'login' }), 600)
  } catch (e) {
    error.value = e?.message || 'Erro inesperado'
  } finally {
    loading.value = false
  }
}

async function safeJson(res) {
  try { return await res.json() } catch { return null }
}
</script>
