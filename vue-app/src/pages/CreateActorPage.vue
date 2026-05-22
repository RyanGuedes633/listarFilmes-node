<template>
  <section>
    <h2 style="margin:.5rem 0;">Criar Ator</h2>
    <p v-if="error" style="color:crimson;">{{ error }}</p>
    <form @submit.prevent="createActor" style="max-width:420px;">
      <div>
        <label>Nome</label>
        <input v-model="form.nome" required />
      </div>
      <div style="display:flex; gap:.5rem; align-items:center;">
        <button type="submit" :disabled="submitting">Criar Ator</button>
        <router-link to="/series">Voltar</router-link>
      </div>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const form = ref({ nome: '' })
const submitting = ref(false)
const error = ref('')

async function createActor() {
  submitting.value = true
  error.value = ''
  try {
    const res = await fetch(`${API_BASE}/actors`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form.value) })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Erro ao criar ator')
    form.value = { nome: '' }
    window.location.href = '/series'
  } catch (e) {
    error.value = e?.message || 'Falha ao criar ator'
  } finally {
    submitting.value = false
  }
}
</script>
