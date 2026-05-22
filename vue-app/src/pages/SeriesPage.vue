<template>
  <section>
    <div style="display:flex; align-items:center; justify-content:space-between;">
      <h2 style="margin:.5rem 0;">Minhas Séries</h2>
      <div style="display:flex; gap:.5rem; align-items:center;">
        <router-link to="/criar-serie">Criar Série</router-link>
        <router-link to="/criar-ator">Criar Ator</router-link>
        <button @click="loadAll" :disabled="loading || actorsLoading">Recarregar</button>
      </div>
    </div>
    <p v-if="loading">Carregando...</p>
    <p v-if="error" style="color:crimson;">{{ error }}</p>

    <ul v-if="movies.length">
      <li v-for="m in movies" :key="m.id" style="margin: .5rem 0; padding:.5rem; border:1px solid #eee; border-radius:6px;">
        <template v-if="editMovie && editMovie.id === m.id">
          <div>
            <label>Título</label>
            <input v-model="editMovie.titulo" />
            <label>Faixa Etária</label>
            <input v-model.number="editMovie.faixaEtaria" type="number" min="0" />
            <label>Gênero</label>
            <input v-model="editMovie.genero" />
            <label>Atores</label>
            <div>
              <small>Selecione atores existentes:</small>
              <div style="display:flex; flex-wrap:wrap; gap:.4rem; margin-top:.3rem;">
                <label v-for="a in actors" :key="a.id" style="border:1px solid #ddd; padding:.2rem .4rem; border-radius:4px;">
                  <input type="checkbox" :value="a.id" v-model="editMovie.atores" /> {{ a.nome }}
                </label>
              </div>
            </div>
            <div style="margin-top:.5rem; display:flex; gap:.5rem;">
              <button @click="saveMovie">Salvar</button>
              <button type="button" @click="cancelEdit">Cancelar</button>
            </div>
          </div>
        </template>
        <template v-else>
          <div style="display:flex; justify-content:space-between; align-items:center; gap:1rem;">
            <div>
              <strong>{{ m.titulo }}</strong>
              <small style="opacity:.7"> • {{ m.genero }} • {{ m.faixaEtaria }}+</small>
              <div v-if="m.atoresDetalhes?.length" style="font-size:.9em; opacity:.85">Atores: {{ m.atoresDetalhes.map(a=>a.nome).join(', ') }}</div>
            </div>
            <div>
              <button @click="startEdit(m)">Editar</button>
              <button @click="removeMovie(m)" style="margin-left:.5rem; color:crimson">Excluir</button>
            </div>
          </div>
        </template>
      </li>
    </ul>
    <p v-else-if="!loading">Nenhuma série encontrada.</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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
    const res = await fetch(`${API_BASE}/movies`)
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
    const res = await fetch(`${API_BASE}/movies/${editMovie.value.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editMovie.value) })
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
    const res = await fetch(`${API_BASE}/movies/${m.id}`, { method: 'DELETE' })
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
    const res = await fetch(`${API_BASE}/actors`)
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
