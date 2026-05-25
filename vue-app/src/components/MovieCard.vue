<template>
    <article class="movie-card">
    <img v-if="posterUrl" :src="posterUrl" :alt="props.movie.name || props.movie.title"/>

    <div>
        
        <h3>{{ props.movie.name || props.movie.title }}</h3>
        
        <p v-if="props.movie.first_air_date">
        Ano: {{ props.movie.first_air_date.slice(0, 4) }}
        </p>
        
        <p v-if="props.movie.vote_average">
        Nota: {{ props.movie.vote_average.toFixed(1) }}
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
    if (!props.movie.poster_path) return ''
    return `https://image.tmdb.org/t/p/w300${props.movie.poster_path}`
})
console.log(props.movie.poster_path) 
</script>