<template>
   <article class="mb-4 flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(0,0,0,0.1)] max-sm:flex-col">
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

      <p class="my-1 text-[0.95rem] leading-[1.4] text-gray-600">
        {{ props.movie.overview || 'Sem descrição.' }}
      </p>

      <button
        class="mt-3 cursor-pointer rounded-md px-4 py-2 font-semibold text-white transition-all duration-300 ease-out hover:-translate-y-px active:translate-y-0 disabled:cursor-not-allowed"
        :class="props.favorited
          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-[0_8px_18px_rgba(16,185,129,0.2)] disabled:bg-emerald-600'
          : 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500'"
        :disabled="props.saving || props.favorited"
        @click="$emit('favorite', props.movie)"
      >
        <transition name="favorite-label" mode="out-in">
          <span :key="props.favorited ? 'favorited' : props.saving ? 'saving' : 'favorite'">
            {{ props.saving ? 'Favoritando...' : props.favorited ? 'Favoritado' : 'Favoritar' }}
          </span>
        </transition>
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

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

defineEmits(['favorite'])

const posterUrl = computed(() => {
    if (!props.movie.poster_path) return ''
    return `https://image.tmdb.org/t/p/w300${props.movie.poster_path}`
})
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
