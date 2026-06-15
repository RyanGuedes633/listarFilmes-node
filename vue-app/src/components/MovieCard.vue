<template>
  <article
   :class="[
     'relative mb-4 flex items-start gap-4 rounded-lg border bg-white p-4 transition duration-200 ease-out hover:-translate-y-0.5 max-sm:flex-col cursor-pointer',
     'border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)]'
   ]"
   @click="openDetails"
   title="Ver detalhes"
  >
    <!-- Botão/Chip de favorito sempre visível -->
    <button
      type="button"
      :class="[
        'absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-1 text-[0.72rem] font-medium shadow-sm ring-1 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-70',
        props.favorited
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
          : 'bg-white/95 text-rose-600 ring-rose-200/70 hover:bg-white'
      ]"
      :disabled="props.saving || props.favorited"
      :aria-disabled="props.saving || props.favorited"
      :title="props.favorited ? 'Favorito' : (props.saving ? 'Favoritando...' : 'Clique para favoritar')"
      @click.stop="$emit('favorite', props.movie)"
    >
      <!-- Ícone coração: contorno quando não favorito, preenchido quando favorito -->
      <svg v-if="!props.favorited" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5">
        <path d="M12.1 20.3c-.1.1-.2.1-.3 0C7 16.3 4 13.7 4 10.5 4 8 6 6 8.5 6c1.3 0 2.6.6 3.5 1.7C13 6.6 14.3 6 15.5 6 18 6 20 8 20 10.5c0 3.2-3 5.8-7.9 9.8z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5 text-emerald-600" fill="currentColor">
        <path d="M12.1 20.3c-.1.1-.2.1-.3 0C7 16.3 4 13.7 4 10.5 4 8 6 6 8.5 6c1.3 0 2.6.6 3.5 1.7C13 6.6 14.3 6 15.5 6 18 6 20 8 20 10.5c0 3.2-3 5.8-7.9 9.8z"/>
      </svg>
      <span class="leading-none">
        {{ props.saving ? 'Favoritando...' : props.favorited ? 'Favorito' : 'Favoritar' }}
      </span>
    </button>

    <img
      v-if="posterUrl"
      :src="posterUrl"
      :alt="props.movie.name || props.movie.title"
      class="h-40 w-[110px] flex-shrink-0 rounded-md bg-gray-100 object-cover max-sm:h-[260px] max-sm:w-full"
    />

    <div class="min-w-0">
      <h3 class="mb-2 text-[1.1rem] font-semibold leading-[1.3] text-gray-900">
        {{ props.movie.name || props.movie.title }}
      </h3>

      <p v-if="props.movie.first_air_date" class="my-1 text-[0.95rem] leading-[1.4] text-gray-600">
        Ano: {{ props.movie.first_air_date.slice(0, 4) }}
      </p>
      <div class="my-2 flex flex-wrap gap-2">
      <p
        v-if="props.movie.faixaEtaria !== null && props.movie.faixaEtaria !== undefined"
          :class="['inline-block rounded-md px-2 py-1 text-sm font-bold', ageRatingClass]"
      >
        Classificação: {{ props.movie.faixaEtaria === 0 ? 'Livre' : props.movie.faixaEtaria + '+' }}
      </p>

      <p
        v-if="props.movie.vote_average"
        class="inline-block rounded-md bg-[#e0c600] px-2 py-1 text-sm font-bold text-[#fefefe] shadow-[0_0_12px_rgba(245,158,11,0.25)]"
      >
        Nota: {{ props.movie.vote_average.toFixed(1) }}
      </p>
      </div>

      <p v-if="props.movie.cast?.length" class="mt-1 text-[0.85rem] text-gray-500">
        {{ props.movie.cast.slice(0, 5).join(', ') }}
      </p>

      <p class="my-1 text-[0.95rem] leading-[1.4] text-gray-600">
        {{ props.movie.overview || 'Sem descrição.' }}
      </p>

    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  favorited: {
    type: Boolean,
    default: false
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const ageRatingClass = computed(() => {
  const faixaEtaria = Number(props.movie.faixaEtaria)

  if (faixaEtaria === 0) return 'bg-green-50 text-green-800 shadow-[0_0_10px_rgba(34,197,94,0.25)]'
  if (faixaEtaria <= 10) return 'bg-blue-50 text-blue-800 shadow-[0_0_10px_rgba(59,130,246,0.25)]'
  if (faixaEtaria <= 12) return 'bg-yellow-50 text-yellow-800 shadow-[0_0_10px_rgba(234,179,8,0.28)]'
  if (faixaEtaria <= 14) return 'bg-orange-50 text-orange-800 shadow-[0_0_10px_rgba(249,115,22,0.25)]'
  if (faixaEtaria <= 16) return 'bg-red-50 text-red-800 shadow-[0_0_10px_rgba(239,68,68,0.25)]'

  return 'bg-gray-900 text-white shadow-[0_0_10px_rgba(17,24,39,0.3)]'
})
const router = useRouter()

defineEmits(['favorite'])

const posterUrl = computed(() => {
    if (!props.movie.poster_path) return ''
    return `https://image.tmdb.org/t/p/w300${props.movie.poster_path}`
})

function openDetails() {
  router.push(`/serie/${props.movie.id}`)
}
</script>

<style scoped>
.favorite-label-enter-active,
.favorite-label-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}

.favorite-label-enter-from,
.favorite-label-leave-to {
  opacity: 0;
  transform: translateY(4px) scale(0.96);
}

.favorite-label-enter-to,
.favorite-label-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
