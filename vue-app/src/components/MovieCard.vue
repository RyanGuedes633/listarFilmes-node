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
<style scoped>
.movie-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.movie-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
}

.movie-card img {
  width: 110px;
  height: 160px;
  object-fit: cover;
  border-radius: 6px;
  flex-shrink: 0;
  background-color: #f3f4f6;
}

.movie-card h3 {
  margin: 0 0 0.5rem;
  color: #111827;
  font-size: 1.1rem;
  line-height: 1.3;
}

.movie-card p {
  margin: 0.25rem 0;
}
.movie-card button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.movie-card button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>