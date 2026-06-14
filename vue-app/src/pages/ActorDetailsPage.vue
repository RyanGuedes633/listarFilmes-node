<template>
  <section class="space-y-4">
    <p v-if="loading">Carregando ator...</p>
    <p v-else-if="error" class="text-[crimson]">{{ error }}</p>

    <div v-else-if="actor">
      <div class="flex flex-col gap-4 md:flex-row md:items-start">
        <img
          v-if="actor.foto"
          :src="actor.foto"
          :alt="actor.nome"
          class="w-60 shrink-0 rounded-lg object-cover bg-[#f3f4f6]"
        />

        <div class="flex-1 max-w-175">
          <h2 class="mb-2 text-2xl font-bold">{{ actor.nome }}</h2>
          <p>Sexo: {{ actor.sexo }}</p>
          <p>Idade: {{ actor.idade }}</p>
          <p v-if="actor.nascimento">Nascimento: {{ actor.nascimento }}</p>
          <p v-if="actor.popularidade">Popularidade: {{ actor.popularidade }}</p>
          <p class="mt-3">{{ actor.biografia || 'Sem biografia disponível.' }}</p>

          <router-link to="/" class="mt-4 inline-block text-blue-600 hover:underline">Voltar</router-link>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="mb-2 text-lg font-bold">Filmes</h3>
        <ul class="list-disc pl-5">
          <li v-for="m in filmes" :key="m.id">
            <span>{{ m.titulo }}</span>
            <span v-if="m.ano"> ({{ m.ano }})</span>
            <span v-if="m.papel"> — {{ m.papel }}</span>
          </li>
        </ul>
        <p v-if="!filmes.length" class="text-[#4b5563]">Nenhum filme encontrado.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY

const loading = ref(false)
const error = ref('')
const actor = ref(null)
const filmes = ref([])

onMounted(loadActor)

async function loadActor() {
  if (!TMDB_KEY) {
    error.value = 'Configure VITE_TMDB_API_KEY no frontend.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const id = route.params.id

    // Detalhes do ator
    const infoRes = await fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${TMDB_KEY}&language=pt-BR`)
    const info = await infoRes.json()

    // Créditos de filmes do ator
    const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${TMDB_KEY}&language=pt-BR`)
    const credits = await creditsRes.json()

    actor.value = {
      id,
      nome: info?.name || 'Sem nome',
      foto: info?.profile_path ? 'https://image.tmdb.org/t/p/w300' + info.profile_path : '',
      sexo: info?.gender === 1 ? 'Feminino' : info?.gender === 2 ? 'Masculino' : 'Não informado',
      idade: info?.birthday ? calcularIdade(info.birthday) : 'Não informado',
      nascimento: info?.birthday || '',
      popularidade: info?.popularity ? info.popularity.toFixed(1) : '',
      biografia: info?.biography || ''
    }

    const movieCast = Array.isArray(credits?.cast) ? credits.cast : []
    filmes.value = movieCast
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      .slice(0, 20)
      .map(m => ({
        id: m.id,
        titulo: m.title || m.original_title || 'Sem título',
        ano: m.release_date ? m.release_date.slice(0, 4) : '',
        papel: m.character || ''
      }))
  } catch (e) {
    error.value = e?.message || 'Erro ao carregar ator'
  } finally {
    loading.value = false
  }
}

function calcularIdade(birthDate) {
  const nascimento = new Date(birthDate)
  if (Number.isNaN(nascimento.getTime())) return 'Não informado'

  const hoje = new Date()
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const mes = hoje.getMonth() - nascimento.getMonth()

  if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }

  return idade >= 0 ? String(idade) : 'Não informado'
}
</script>
