<template>
  <section>
    <p v-if="loading">Carregando séries populares...</p>
    <p v-if="error" style="color:crimson;">{{ error }}</p>
    <SearchBar @buscar="(v, m) => { busca = v; modoBusca = m }" />
   <MovieCard 
      v-for="serie in seriesFiltradas"
      :key="serie.id" 
      :movie="serie" 
    :favorited="doneTitles.has(normalizeTitle(serie))"
    :saving="savingIds.has(serie.id)"
      @favorite="favorite"
    />

  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MovieCard from '../components/MovieCard.vue'
import SearchBar from '../components/SearchBar.vue'

const busca = ref('')
const modoBusca = ref('series') // 'series' | 'atores'

const seriesFiltradas = computed(() => {
  if (!busca.value) return series.value

  if (modoBusca.value === 'series') {
    return series.value.filter(s =>
        s.name?.toLowerCase().includes(busca.value.toLowerCase())
    )
  }

  // busca por ator: filtra séries que têm o ator no elenco
  return series.value.filter(s =>
      s.cast?.some(ator =>
          ator.toLowerCase().includes(busca.value.toLowerCase())
      )
  )
})

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const series = ref([])
const loading = ref(false)
const error = ref('')

// Controle de estado do botão Favoritar
const savingIds = ref(new Set())
const doneTitles = ref(new Set())

function normalizeTitle(item) {
  return String(item?.name || item?.title || '').trim().toLowerCase()
}

async function loadFavorites() {
  const res = await fetch(`${API_BASE}/movies`)
  if (!res.ok) throw new Error('Falha ao carregar séries favoritas')
  const movies = await res.json()
  doneTitles.value = new Set((movies || []).map((movie) => String(movie?.titulo || '').trim().toLowerCase()).filter(Boolean))
}

async function favorite(item) {
  const id = item?.id
  const titleKey = normalizeTitle(item)
  if (!id || savingIds.value.has(id) || doneTitles.value.has(titleKey)) return
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
    // Marca como favorito usando o título salvo no backend
    doneTitles.value.add(titleKey)
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
    const popularRes = await fetch(`${API_BASE}/movies/tmdb/popular`)
    if (!popularRes.ok) throw new Error('Falha ao buscar séries populares')
    series.value = await popularRes.json()

    try {
      await loadFavorites()
    } catch {
      // Se a lista de favoritas falhar, a página continua carregando normalmente.
    }
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
