<template>
  <article class="group rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg 2xl:p-5">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div class="min-w-0">
        <router-link
          v-if="movie.tmdbId"
          :to="`/serie/${movie.tmdbId}`"
          class="block"
        >
          <h3 class="truncate text-lg font-semibold text-slate-900 group-hover:text-sky-700">
            {{ movie.titulo }}
          </h3>
        </router-link>
        <h3 v-else class="text-lg font-semibold text-slate-900">
          {{ movie.titulo }}
        </h3>

        <div class="mt-2 flex flex-wrap gap-2 text-xs font-semibold 2xl:text-[0.8rem]">
          <span class="rounded-full bg-sky-50 px-3 py-1 text-sky-700">{{ movie.genero || 'Sem gênero' }}</span>
          <span class="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{{ faixaLabel }}</span>
        </div>

        <p v-if="atoresTexto" class="mt-3 text-sm leading-6 text-slate-600 2xl:text-[0.95rem]">
          <span class="font-semibold text-slate-700">Atores:</span> {{ atoresTexto }}
        </p>
      </div>

      <div class="grid grid-cols-2 gap-2 sm:flex sm:shrink-0 sm:grid-cols-none 2xl:flex-col 2xl:items-stretch">
        <button
          class="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 2xl:px-4"
          @click="$emit('edit', movie)"
        >
          Editar
        </button>
        <button
          class="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-rose-700 2xl:px-4"
          @click="$emit('remove', movie)"
        >
          Excluir
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true,
  },
})

defineEmits(['edit', 'remove'])

const faixaLabel = computed(() => {
  const faixa = Number(props.movie.faixaEtaria)
  if (!Number.isFinite(faixa)) return 'Classificação não informada'
  return faixa === 0 ? 'Livre' : `${faixa}+`
})

const atoresTexto = computed(() => {
  const nomes = Array.isArray(props.movie.atoresDetalhes)
    ? props.movie.atoresDetalhes.map((ator) => ator?.nome).filter(Boolean)
    : []

  return nomes.length ? nomes.join(', ') : ''
})
</script>