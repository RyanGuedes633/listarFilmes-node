<template>
  <section>
    <h2 style="margin: .5rem 0;">Séries Populares (TMDB)</h2>
    <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.5rem;">
      <button @click="load" :disabled="loading">Recarregar</button>
    </div>
    <p v-if="loading">Carregando séries populares...</p>
    <p v-if="error" style="color:crimson;">{{ error }}</p>

   <MovieCard 
      v-for="serie in series" 
      :key="serie.id" 
      :movie="serie" 
      @favorite="favorite"
    />

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MovieCard from '../components/MovieCard.vue'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const series = ref([])
const loading = ref(false)
const error = ref('')

// Controle de estado do botão Favoritar
const savingIds = ref(new Set())
const doneIds = ref(new Set())

async function favorite(item) {
  const id = item?.id
  if (!id || savingIds.value.has(id) || doneIds.value.has(id)) return
  error.value = ''
  savingIds.value.add(id)
  try {
    const res = await fetch(`${API_BASE}/movies/tmdb/favorite`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(t || 'Falha ao favoritar série')
    }
    // Marca como concluído
    doneIds.value.add(id)
  } catch (e) {
    error.value = e?.message || 'Erro ao favoritar'
  } finally {
    savingIds.value.delete(id)
  }
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/movies/tmdb/popular`)
    if (!res.ok) throw new Error('Falha ao buscar séries populares')
    series.value = await res.json()
  } catch (e) {
    error.value = e?.message || 'Erro ao carregar'
  } finally {
    loading.value = false
  }
}

onMounted(() => { load() })

function btnStyle(active) {
  return {
    background: active ? '#0a7' : '#f7f7f7',
    color: active ? 'white' : 'black',
    border: '1px solid #ddd',
    padding: '.35rem .5rem',
    borderRadius: '6px',
    cursor: 'pointer'
  }
}
</script>
