<template>
  <section class="rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-4 shadow-sm sm:p-5 2xl:p-8">
    <div class="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-sky-600">Minha biblioteca</p>
        <h2 class="mt-1 text-xl font-bold text-slate-900 sm:text-2xl 2xl:text-3xl">Séries favoritados</h2>
      </div>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
      <svg class="animate-spin h-8 w-8 text-[#015C91]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm font-medium">Carregando...</span>
    </div>
    <p v-if="error" class="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{{ error }}</p>

    <div v-if="movies.length" class="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 2xl:gap-5">
      <template v-for="m in movies" :key="m.id">
        <div v-if="editMovie && editMovie.id === m.id" class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div class="grid gap-3">
            <label class="text-sm font-medium text-slate-700">Título</label>
            <input v-model="editMovie.titulo" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />

            <label class="text-sm font-medium text-slate-700">Faixa Etária</label>
            <input v-model.number="editMovie.faixaEtaria" type="number" min="0" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />

            <label class="text-sm font-medium text-slate-700">Gênero</label>
            <input v-model="editMovie.genero" class="rounded-xl border border-slate-300 px-3 py-2 outline-none focus:border-sky-500" />

            <label class="text-sm font-medium text-slate-700">Atores</label>
            <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <small class="block text-slate-500">Selecione atores existentes:</small>
              <div class="mt-3 flex flex-wrap gap-2">
                <label
                  v-for="a in actors"
                  :key="a.id"
                  class="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700"
                >
                  <input type="checkbox" :value="a.id" v-model="editMovie.atores" />
                  {{ a.nome }}
                </label>
              </div>
            </div>

            <div class="mt-1 flex flex-col gap-2 sm:flex-row">
              <button @click="saveMovie" class="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">Salvar</button>
              <button type="button" @click="cancelEdit" class="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Cancelar</button>
            </div>
          </div>
        </div>

        <SerieFavCard
          v-else
          :movie="m"
          @edit="startEdit"
          @remove="removeMovie"
        />
      </template>
    </div>

    <p v-else-if="!loading" class="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
      Nenhuma série encontrada.
    </p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SerieFavCard from '../components/SerieFavCard.vue'
import { useAuth } from '../stores/auth.js'

const { user } = useAuth()

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const error = ref('')

// Movies list
const movies = ref([])
const loading = ref(false)
const editMovie = ref(null)

async function loadMovies() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/movies`, {
      headers: { 'X-User-Id': user.value?.id || '' }
    })
    movies.value = await res.json()
  } catch (e) {
    error.value = e?.message || 'Falha ao carregar séries'
  } finally {
    loading.value = false
  }
}

function startEdit(m) {
  editMovie.value = { id: m.id, titulo: m.titulo, faixaEtaria: m.faixaEtaria, genero: m.genero, atores: [...(m.atores||[])] }
}
function cancelEdit() { editMovie.value = null }

async function saveMovie() {
  if (!editMovie.value) return
  try {
    const res = await fetch(`${API_BASE}/movies/${editMovie.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.value?.id || ''
      },
      body: JSON.stringify(editMovie.value)
    })
    if (!res.ok) throw new Error((await res.json()).error || 'Erro ao atualizar')
    editMovie.value = null
    await loadMovies()
  } catch (e) {
    error.value = e?.message || 'Falha ao atualizar série'
  }
}

async function removeMovie(m) {
  if (!confirm(`Excluir a série "${m.titulo}"?`)) return
  try {
    const res = await fetch(`${API_BASE}/movies/${m.id}`, {
      method: 'DELETE',
      headers: { 'X-User-Id': user.value?.id || '' }
    })
    if (!res.ok) throw new Error((await res.json()).error || 'Erro ao excluir')
    await loadMovies()
  } catch (e) {
    error.value = e?.message || 'Falha ao excluir série'
  }
}

// Actors for editing checkboxes
const actors = ref([])
const actorsLoading = ref(false)

async function loadActors() {
  actorsLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/actors`, {
      headers: { 'X-User-Id': user.value?.id || '' }
    })
    actors.value = await res.json()
  } catch (e) {
    // ignore
  } finally {
    actorsLoading.value = false
  }
}

async function loadAll() { await Promise.all([loadMovies(), loadActors()]) }

onMounted(() => { loadAll() })
</script>
