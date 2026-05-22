<template>
  <section>
    <h2 style="margin: .5rem 0;">Séries Populares (TMDB)</h2>
    <div style="display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.5rem;">
      <button @click="load" :disabled="loading">Recarregar</button>
    </div>
    <p v-if="loading">Carregando séries populares...</p>
    <p v-if="error" style="color:crimson;">{{ error }}</p>

    <ul v-if="series.length">
      <li v-for="s in series" :key="s.id" style="margin:.5rem 0; padding:.5rem; border:1px solid #eee; border-radius:6px; display:flex; gap:.75rem; align-items:flex-start;">
        <div style="flex:1;">
          <strong>{{ s.name || s.title }}</strong>
          <div style="opacity:.8; font-size:.9em;">
            <span v-if="s.first_air_date">{{ (s.first_air_date||'').slice(0,4) }}</span>
            <span v-if="s.vote_average"> • Nota {{ s.vote_average?.toFixed ? s.vote_average.toFixed(1) : s.vote_average }}</span>
          </div>
          <div style="opacity:.85; margin-top:.25rem;">
            {{ s.overview || 'Sem descrição.' }}
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:.35rem; min-width: 160px;">
          <button @click="favorite(s)" :disabled="savingIds.has(s.id) || doneIds.has(s.id)" :style="btnStyle(doneIds.has(s.id))">{{ doneIds.has(s.id) ? 'Favoritado!' : (savingIds.has(s.id) ? 'Salvando...' : 'Favoritar') }}</button>
        </div>
      </li>
    </ul>

    <p v-else-if="!loading">Nada para mostrar.</p>

  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
