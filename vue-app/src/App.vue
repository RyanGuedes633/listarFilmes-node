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

    <section style="margin-top:1rem; background:#f7f7f7; padding: .75rem; border-radius:8px;">
      <strong>Seed de séries:</strong>
      <button @click="runSeed" :disabled="seedLoading" style="margin-left:.5rem">Executar</button>
      <span v-if="seedMsg" style="margin-left:.5rem">{{ seedMsg }}</span>
    </section>

    <p v-if="error" style="color:crimson; margin-top: .5rem;">{{ error }}</p>

    <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 1.25rem;">
      <!-- Séries -->
      <section>
        <h2>Séries</h2>
        <button @click="loadAll" :disabled="loading">Recarregar</button>
        <p v-if="loading">Carregando...</p>
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

        <h3 style="margin-top:1rem;">Nova Série</h3>
        <form @submit.prevent="createMovie">
          <div>
            <label>Título</label>
            <input v-model="form.titulo" required />
          </div>
          <div>
            <label>Faixa Etária</label>
            <input v-model.number="form.faixaEtaria" type="number" min="0" />
          </div>
          <div>
            <label>Gênero</label>
            <input v-model="form.genero" />
          </div>
          <div>
            <label>Atores</label>
            <div style="display:flex; flex-wrap:wrap; gap:.4rem;">
              <label v-for="a in actors" :key="a.id" style="border:1px solid #ddd; padding:.2rem .4rem; border-radius:4px;">
                <input type="checkbox" :value="a.id" v-model="form.atores" /> {{ a.nome }}
              </label>
            </div>
          </div>
          <button type="submit" :disabled="submitting">Criar</button>
        </form>
      </section>

      <!-- Atores -->
      <section>
        <h2>Atores</h2>
        <button @click="loadActors" :disabled="actorsLoading">Recarregar</button>
        <p v-if="actorsLoading">Carregando atores...</p>
        <ul v-if="actors.length">
          <li v-for="a in actors" :key="a.id" style="display:flex; justify-content:space-between; align-items:center; padding:.25rem 0;">
            <span>{{ a.nome }}</span>
            <button @click="removeActor(a)" style="color:crimson">Excluir</button>
          </li>
        </ul>
        <p v-else-if="!actorsLoading">Nenhum ator encontrado.</p>

        <h3 style="margin-top:1rem;">Novo Ator</h3>
        <form @submit.prevent="createActor">
          <div>
            <label>Nome</label>
            <input v-model="actorForm.nome" required />
          </div>
          <button type="submit" :disabled="actorSubmitting">Criar Ator</button>
        </form>
      </section>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

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

async function runSeed() {
  seedLoading.value = true
  seedMsg.value = ''
  try {
    const res = await fetch(`${API_BASE}/seed`, { method: 'POST' })
    const data = await res.json()
    seedMsg.value = `inserted=${data.inserted||0} skipped=${data.skipped||0} errors=${(data.errors||[]).length}`
    await loadAll()
  } catch (e) {
    seedMsg.value = 'Falha ao executar seed'
  } finally {
    seedLoading.value = false
  }
}

// Movies
const movies = ref([])
const loading = ref(false)
const submitting = ref(false)
const form = ref({ titulo: '', faixaEtaria: 12, genero: 'Ação', atores: [] })
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

async function createMovie() {
  submitting.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/movies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
    if (!res.ok) throw new Error((await res.json()).error || 'Erro ao criar')
    form.value = { titulo: '', faixaEtaria: 12, genero: 'Ação', atores: [] }
    await loadMovies()
  } catch (e) {
    error.value = e?.message || 'Falha ao criar'
  } finally {
    submitting.value = false
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

// Actors
const actors = ref([])
const actorsLoading = ref(false)
const actorForm = ref({ nome: '' })
const actorSubmitting = ref(false)

async function loadActors() {
  actorsLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/actors`)
    actors.value = await res.json()
  } catch (e) {
    // ignore for now
  } finally {
    actorsLoading.value = false
  }
}

async function createActor() {
  actorSubmitting.value = true
  try {
    const res = await fetch(`${API_BASE}/actors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(actorForm.value) })
    const data = await res.json()
    if (!('id' in data)) throw new Error(data?.error || 'Erro ao criar ator')
    actorForm.value = { nome: '' }
    await loadActors()
  } catch (e) {
    error.value = e?.message || 'Falha ao criar ator'
  } finally {
    actorSubmitting.value = false
  }
}

async function removeActor(a) {
  if (!confirm(`Excluir o ator "${a.nome}"?`)) return
  try {
    const res = await fetch(`${API_BASE}/actors/${a.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (data?.error) throw new Error(data.error)
    await Promise.all([loadActors(), loadMovies()])
  } catch (e) {
    error.value = e?.message || 'Falha ao excluir ator'
  }
}

async function loadAll() { await Promise.all([loadMovies(), loadActors()]) }

onMounted(() => { checkHealth(); loadAll() })
</script>

<style scoped>
label { display:block; margin-top:.5rem; }
input { padding:.4rem .5rem; margin-top:.2rem; }
button { margin-top:.4rem; padding:.35rem .6rem; }
ul { list-style: none; padding-left: 0; }
</style>
