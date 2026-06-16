<template>
  <section class="p-4">
    <div class="max-w-xl">
      <h2 class="text-2xl font-semibold mb-4">Cadastrar Ator</h2>
      <p v-if="error" class="text-red-600 mb-4">{{ error }}</p>

      <form @submit.prevent="createActor" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium">Nome</label>
          <input
            v-model="form.nome"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-1 font-medium">Nacionalidade</label>
          <input
            v-model="form.nacionalidade"
            type="text"
            placeholder="Ex.: Brasileira"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-1 font-medium">Idade</label>
          <input
            v-model.number="form.idade"
            type="number"
            min="0"
            step="1"
            placeholder="Ex.: 35"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block mb-1 font-medium">Gênero</label>
          <select
            v-model="form.genero"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Não binário">Não binário</option>
            <option value="Outro">Outro</option>
            <option value="Prefiro não informar">Prefiro não informar</option>
          </select>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="submit"
            :disabled="submitting"
            class="inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {{ submitting ? 'Salvando...' : 'Criar Ator' }}
          </button>
          <router-link to="/series" class="text-blue-600 hover:underline">Voltar</router-link>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/auth.js'

const { user } = useAuth()

const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const submitting = ref(false)
const error = ref('')

const form = ref({
  nome: '',
  nacionalidade: '',
  idade: null,
  genero: 'Masculino',
})

async function createActor() {
  submitting.value = true
  error.value = ''
  try {
    const payload = { ...form.value }
    const res = await fetch(`${API_BASE}/actors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.value?.id || ''
      },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error || 'Erro ao criar ator')

    // Limpa formulário
    form.value = { nome: '', nacionalidade: '', idade: null, genero: 'Masculino' }

    // Volta para a lista de séries
    window.location.href = '/series'
  } catch (e) {
    error.value = e?.message || 'Falha ao criar ator'
  } finally {
    submitting.value = false
  }
}
</script>
