<template>
  <section class="space-y-4">
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 gap-3 text-slate-500">
      <svg class="animate-spin h-8 w-8 text-[#015C91]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-sm font-medium">Carregando ator...</span>
    </div>
    <p v-else-if="error" class="text-[crimson]">{{ error }}</p>

    <div v-else-if="actor">
      <div class="flex flex-col gap-4 md:flex-row md:items-center">
        <img
          v-if="actor.foto"
          :src="actor.foto"
          :alt="actor.nome"
          class="w-70 shrink-0 rounded-xl object-cover md:w-70 bg-[#f3f4f6]"
        />

        <div class="flex-1 max-w-175 text-center md:text-left">
          <h2 class="mb-2 text-2xl font-bold">{{ actor.nome }}</h2>
          <p>Sexo: {{ actor.sexo }}</p>
          <p>Idade: {{ actor.idade }}</p>
          <p v-if="actor.nascimento">Nascimento: {{ formatDateBR(actor.nascimento) }}</p>
          <p v-if="actor.popularidade">Popularidade: {{ actor.popularidade }}</p>
          <p class="my-3 leading-6">{{ actor.biografia || 'Sem biografia disponível.' }}</p>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="mb-3 text-lg font-bold">Séries</h3>
        <div class="grid grid-cols-1 gap-3">
          <MovieCard
            v-for="serie in filmes"
            :key="serie.id"
            :movie="serie"
            :favorited="doneTitles.has(normalizeTitle(serie))"
            :saving="savingIds.has(serie.id)"
            @favorite="favorite"
          />
        </div>
        <p v-if="!filmes.length" class="text-[#4b5563]">Nenhuma série encontrada.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MovieCard from '../components/MovieCard.vue'
import { useAuth } from '../stores/auth.js'

const { user } = useAuth()

const route = useRoute()
const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY
const loading = ref(false)
const error = ref('')
const actor = ref(null)
const filmes = ref([])

// Favoritos (mesma lógica da HomePage)
const API_BASE = import.meta.env.VITE_API_BASE || '/api'
const savingIds = ref(new Set())
const doneTitles = ref(new Set())

function normalizeTitle(item) {
  return String(item?.name || item?.title || '').trim().toLowerCase()
}

async function loadFavorites() {
  try {
    const res = await fetch(`${API_BASE}/movies`, {
      headers: { 'X-User-Id': user.value?.id || '' }
    })
    if (!res.ok) return
    const movies = await res.json()
    doneTitles.value = new Set((movies || [])
      .map(m => String(m?.titulo || '').trim().toLowerCase())
      .filter(Boolean))
  } catch {}
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
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': user.value?.id || ''
      },
      body: JSON.stringify(item),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      throw new Error(t || 'Falha ao favoritar série')
    }
    doneTitles.value.add(titleKey)
  } catch (e) {
    error.value = e?.message || 'Erro ao favoritar'
  } finally {
    savingIds.value.delete(id)
  }
}

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

    // Créditos de séries de TV do ator
    const creditsRes = await fetch(`https://api.themoviedb.org/3/person/${id}/tv_credits?api_key=${TMDB_KEY}&language=pt-BR`)
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

    const tvCast = Array.isArray(credits?.cast) ? credits.cast : []
    filmes.value = tvCast
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0))
      .slice(0, 20)
      .map(s => ({
        // Mapeia no formato que o MovieCard espera (itens de série da TMDB)
        id: s.id,
        name: s.name || s.original_name || 'Sem título',
        first_air_date: s.first_air_date || '',
        vote_average: typeof s.vote_average === 'number' ? s.vote_average : Number(s.vote_average || 0),
        overview: s.overview || '',
        poster_path: s.poster_path || '',
        // campos opcionais que o MovieCard ignora se ausentes
        faixaEtaria: null,
        cast: []
      }))

    // Após carregar séries, carrega favoritos para marcar já favoritados
    await loadFavorites()
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

function formatDateBR(dateStr) {
  if (!dateStr) return ''
  const parts = String(dateStr).split('-')
  if (parts.length === 3) {
    const [y, m, d] = parts
    return `${String(d).padStart(2, '0')}-${String(m).padStart(2, '0')}-${y}`
  }
  const dt = new Date(dateStr)
  if (Number.isNaN(dt.getTime())) return String(dateStr)
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = dt.getFullYear()
  return `${dd}-${mm}-${yyyy}`
}
</script>
