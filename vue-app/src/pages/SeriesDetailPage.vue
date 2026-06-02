<template>
  <section class="space-y-4">
    <p v-if="loading">Carregando detalhes...</p>
    <p v-else-if="error" class="text-[crimson]">{{ error }}</p>

    <div v-else-if="details">
      <div class="flex flex-col gap-4 md:flex-row md:items-center">
        <img
          v-if="details.poster"
          :src="details.poster"
          :alt="details.title"
          class="w-70 shrink-0 rounded-xl object-cover md:w-70"
        />

        <div class="flex-1 max-w-175 text-center md:text-left">
          <h2 class="mb-2 text-2xl font-bold">{{ details.title }}</h2>
          <p v-if="details.year">Ano: {{ details.year }}</p>
          <p v-if="details.rating">Nota: {{ details.rating }}</p>
          <p v-if="details.genres.length">Gêneros: {{ details.genres.join(', ') }}</p>
          <p class="my-3 leading-6">{{ details.overview || 'Sem descrição.' }}</p>
        </div>
      </div>

      <h3 class="mt-4 mb-2 text-lg font-bold">Atores</h3>
      <div class="flex flex-wrap gap-3">
        <ActorCard v-for="actor in details.cast" :key="actor.id" :actor="actor" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import ActorCard from '../components/ActorCard.vue'

const route = useRoute()
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const loading = ref(false)
const error = ref('')
const details = ref(null)

async function loadDetails() {
  if (!TMDB_KEY) {
    error.value = 'Configure VITE_TMDB_API_KEY no frontend.'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const id = route.params.id
    const base = 'https://api.themoviedb.org/3/tv/' + id

    const [infoRes, creditsRes] = await Promise.all([
      fetch(base + '?api_key=' + TMDB_KEY + '&language=pt-BR'),
      fetch(base + '/credits?api_key=' + TMDB_KEY + '&language=pt-BR')
    ])

    const info = await infoRes.json()
    const credits = await creditsRes.json()
    const cast = (credits?.cast || []).slice(0, 8)

    const castWithDetails = await Promise.all(cast.map(async (actor) => {
      const actorRes = await fetch(
        'https://api.themoviedb.org/3/person/' + actor.id + '?api_key=' + TMDB_KEY + '&language=pt-BR'
      )
      const actorData = await actorRes.json()

      return {
        id: actor.id,
        nome: actorData?.name || actor?.name || '',
        foto: actorData?.profile_path ? 'https://image.tmdb.org/t/p/w185' + actorData.profile_path : '',
        sexo: actorData?.gender === 1 ? 'Feminino' : actorData?.gender === 2 ? 'Masculino' : 'Não informado',
        idade: actorData?.birthday ? calcularIdade(actorData.birthday) : 'Não informado'
      }
    }))

    details.value = {
      title: info?.name || 'Sem título',
      poster: info?.poster_path ? 'https://image.tmdb.org/t/p/w500' + info.poster_path : '',
      year: info?.first_air_date ? info.first_air_date.slice(0, 4) : '',
      rating: info?.vote_average ? info.vote_average.toFixed(1) : '',
      genres: (info?.genres || []).map(g => g.name).filter(Boolean),
      overview: info?.overview || '',
      cast: castWithDetails
    }
  } catch (e) {
    error.value = e?.message || 'Erro ao carregar detalhes'
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

onMounted(loadDetails)
</script>