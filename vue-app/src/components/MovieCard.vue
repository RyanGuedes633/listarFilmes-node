<template>
    <article class="movie-card">
    <img v-if="movie.poster_path" :src="movie.poster_path" :alt="movie.name || movie.title"/>

    <div>
        
        <h3>{{ movie.name || movie.title }}</h3>
        
        <p v-if="movie.first_air_date">
        Ano: {{ movie.first_air_date.slice(0, 4) }}
        </p>
        
        <p v-if="movie.vote_average">
        Nota: {{ movie.vote_average.toFixed(1) }}
        </p>

        <p>
        {{ movie.overview || 'Sem descrição.' }}
        </p>

        <button @click="$emit('favorite', movie)">
        Favoritar
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
  }
})

defineEmits(['favorite'])

const posterUrl = computed(() => {
  return `https://image.tmdb.org/t/p/w342${props.movie.poster_path}`
})
</script>