<template>
  <article
    class="group relative flex w-40 flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-white p-[0.6rem] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-md hover:border-slate-300 focus-within:-translate-y-0.5 focus-within:shadow-md"
    role="link"
    tabindex="0"
    aria-label="Abrir detalhes do ator"
    title="Clique no card para ver detalhes do ator"
    @click="openDetails"
  >
    <!-- Botão de favoritar ator -->
    <button
      type="button"
      :class="[
        'absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full px-2 py-1 text-[0.72rem] font-medium shadow-sm ring-1 transition-all duration-200 cursor-pointer',
        favorited
          ? 'opacity-100 translate-y-0 bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100'
          : 'opacity-0 translate-y-[-2px] group-hover:opacity-100 group-hover:translate-y-0 bg-white/90 text-rose-600 ring-rose-200/70 hover:bg-white'
      ]"
      aria-label="Favoritar ator"
      :title="favorited ? 'Favorito' : 'Clique para favoritar'"
      @click.stop="onFavClick"
    >
      <!-- Ícone coração: contorno quando não favorito, preenchido quando favorito -->
      <svg v-if="!favorited" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="h-3.5 w-3.5">
        <path d="M12.1 20.3c-.1.1-.2.1-.3 0C7 16.3 4 13.7 4 10.5 4 8 6 6 8.5 6c1.3 0 2.6.6 3.5 1.7C13 6.6 14.3 6 15.5 6 18 6 20 8 20 10.5c0 3.2-3 5.8-7.9 9.8z"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-3.5 w-3.5 text-emerald-600" fill="currentColor">
        <path d="M12.1 20.3c-.1.1-.2.1-.3 0C7 16.3 4 13.7 4 10.5 4 8 6 6 8.5 6c1.3 0 2.6.6 3.5 1.7C13 6.6 14.3 6 15.5 6 18 6 20 8 20 10.5c0 3.2-3 5.8-7.9 9.8z"/>
      </svg>
      <span class="leading-none">{{ favorited ? 'Favorito' : 'Clique para favoritar' }}</span>
    </button>

    <img
      v-if="actor.foto"
      :src="actor.foto"
      :alt="actor.nome"
      class="h-45 w-full rounded-lg object-cover bg-[#f3f4f6] transition-transform duration-200 ease-out group-hover:scale-[1.01] group-hover:brightness-[0.98]"
    />

    <div class="text-center">
      <strong class="transition-colors duration-200 group-hover:text-slate-900">{{ actor.nome }}</strong>
      <p class="mt-1 text-[0.9rem] text-[#4b5563]">Sexo: {{ actor.sexo }}</p>
      <p class="mt-1 text-[0.9rem] text-[#4b5563]">Idade: {{ actor.idade }}</p>
    </div>
  </article>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  actor: {
    type: Object,
    required: true
  },
  // permite iniciar já como favoritado se necessário no futuro
  initialFavorited: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['favorite-actor', 'unfavorite-actor'])

const favorited = ref(!!props.initialFavorited)

function onFavClick() {
  favorited.value = !favorited.value
  emit(favorited.value ? 'favorite-actor' : 'unfavorite-actor', props.actor)
}

const router = useRouter()

function openDetails() {
  if (!props.actor || props.actor.id == null) return
  router.push({ name: 'actor-detail', params: { id: props.actor.id } })
}
</script>