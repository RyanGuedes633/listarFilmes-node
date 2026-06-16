<template>
  <section class="w-full m-0 p-4">
    <h2 class="mt-2 mb-4 text-xl font-bold text-slate-900">Criar Série</h2>
    <p v-if="error" class="mb-4 text-[#dc143c]">{{ error }}</p>
    <form @submit.prevent="createMovie" class="max-w-[520px]">
      <div class="mb-4">
        <label class="block mb-[0.35rem] font-semibold text-slate-800">Título</label>
        <input
          v-model="form.titulo"
          required
          class="w-full px-[0.85rem] py-[0.7rem] border border-[#d1d5db] rounded-[8px] box-border outline-none focus:border-[#2563eb]"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-[0.35rem] font-semibold text-slate-800">Faixa Etária</label>
        <input
          v-model.number="form.faixaEtaria"
          type="number"
          min="0"
          class="w-full px-[0.85rem] py-[0.7rem] border border-[#d1d5db] rounded-[8px] box-border outline-none focus:border-[#2563eb]"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-[0.35rem] font-semibold text-slate-800">Gênero</label>
        <input
          v-model="form.genero"
          class="w-full px-[0.85rem] py-[0.7rem] border border-[#d1d5db] rounded-[8px] box-border outline-none focus:border-[#2563eb]"
        />
      </div>
      <div class="mb-4">
        <label class="block mb-[0.35rem] font-semibold text-slate-800">Atores</label>
        <div class="flex flex-wrap gap-2">
          <label
            v-for="a in actors"
            :key="a.id"
            class="inline-flex items-center gap-[0.35rem] px-[0.5rem] py-[0.25rem] border border-[#d1d5db] rounded-[8px] text-sm font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors"
          >
            <input type="checkbox" :value="a.id" v-model="form.atores" /> {{ a.nome }}
          </label>
        </div>
      </div>
      <div class="flex gap-2 items-center max-sm:flex-col max-sm:items-stretch">
        <button
          type="submit"
          :disabled="submitting"
          class="px-4 py-[0.7rem] border-0 rounded-[8px] bg-[#2563eb] text-white cursor-pointer font-semibold max-sm:w-full text-center hover:bg-[#1d4ed8] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Criar
        </button>
        <router-link
          to="/series"
          class="text-[#2563eb] no-underline font-semibold max-sm:w-full text-center hover:underline py-[0.7rem]"
        >
          Voltar
        </router-link>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../stores/auth.js'

const { user } = useAuth()

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const error = ref('')
const submitting = ref(false)

const form = ref({ titulo: '', faixaEtaria: 12, genero: 'Ação', atores: [] })

const actors = ref([])
const actorsLoading = ref(false)
async function loadActors() {
  actorsLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/actors`, {
      headers: { 'X-User-Id': user.value?.id || '' }
    })
    actors.value = await res.json()
  } catch (e) { /* ignore */ } finally { actorsLoading.value = false }
}

async function createMovie() {
  submitting.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.value?.id || ''
      },
      body: JSON.stringify(form.value)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Erro ao criar')
    form.value = { titulo: '', faixaEtaria: 12, genero: 'Ação', atores: [] }
    // navega para Minhas Séries
    window.location.href = '/series'
  } catch (e) {
    error.value = e?.message || 'Falha ao criar'
  } finally {
    submitting.value = false
  }
}

onMounted(() => { loadActors() })
</script>
