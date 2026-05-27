<template>
  <section>
    <h2 style="margin:.5rem 0;">Criar Série</h2>
    <p v-if="error" style="color:crimson;">{{ error }}</p>
    <form @submit.prevent="createMovie" style="max-width:520px;">
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
      <div style="display:flex; gap:.5rem; align-items:center;">
        <button type="submit" :disabled="submitting">Criar</button>
        <router-link to="/series">Voltar</router-link>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const error = ref('')
const submitting = ref(false)

const form = ref({ titulo: '', faixaEtaria: 12, genero: 'Ação', atores: [] })

const actors = ref([])
const actorsLoading = ref(false)
async function loadActors() {
  actorsLoading.value = true
  try {
    const res = await fetch(`${API_BASE}/actors`)
    actors.value = await res.json()
  } catch (e) { /* ignore */ } finally { actorsLoading.value = false }
}

async function createMovie() {
  submitting.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/movies`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
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

<style scoped>
  section {
    width: 100%;
    margin: 0;
    padding: 1rem;
  }

  h2 {
    margin: .5rem 0 1rem;
  }

  p {
    margin-bottom: 1rem;
    color: crimson;
  }

  form {
    max-width: 520px;
  }

  form > div {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: .35rem;
    font-weight: 600;
  }

  input {
    width: 100%;
    padding: .7rem .85rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    box-sizing: border-box;
  }

  div[style*="display:flex; flex-wrap:wrap; gap:.4rem;"] {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
  }

  div[style*="border:1px solid #ddd"] {
    display: inline-flex;
    align-items: center;
    gap: .35rem;
    padding: .25rem .5rem;
    border: 1px solid #d1d5db;
    border-radius: 8px;
  }

  div[style*="display:flex; gap:.5rem; align-items:center;"] {
    display: flex;
    gap: .5rem;
    align-items: center;
  }

  button {
    padding: .7rem 1rem;
    border: 0;
    border-radius: 8px;
    background: #2563eb;
    color: white;
    cursor: pointer;
  }

  a {
    color: #2563eb;
    text-decoration: none;
  }

  @media (max-width: 640px) {
    div[style*="display:flex; gap:.5rem; align-items:center;"] {
      flex-direction: column;
      align-items: stretch;
    }

    button,
    a {
      width: 100%;
      text-align: center;
    }
  }
</style>
