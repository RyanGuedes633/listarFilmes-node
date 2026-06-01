<template>
    <article class="movie-card">
    <img v-if="posterUrl" :src="posterUrl" :alt="props.movie.name || props.movie.title"/>

    <div>
        
        <h3>{{ props.movie.name || props.movie.title }}</h3>
        
        <p v-if="props.movie.first_air_date">
        Ano: {{ props.movie.first_air_date.slice(0, 4) }}
        </p>

        <p v-if="props.movie.faixaEtaria !== null && props.movie.faixaEtaria !== undefined":class="['movie-age-rating', ageRatingClass]">
        Classificação: {{ props.movie.faixaEtaria === 0 ? 'Livre' : props.movie.faixaEtaria + '+' }}
        </p>
        
        <p v-if="props.movie.vote_average" class="movie-rating">
        Nota: {{ props.movie.vote_average.toFixed(1) }}
        </p>

        <p>
        {{ props.movie.overview || 'Sem descrição.' }}
        </p>

        <button @click="$emit('favorite', props.movie)">
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

const ageRatingClass = computed(() => {
  const faixaEtaria = Number(props.movie.faixaEtaria)

  if (faixaEtaria === 0) return 'age-free'
  if (faixaEtaria <= 10) return 'age-10'
  if (faixaEtaria <= 12) return 'age-12'
  if (faixaEtaria <= 14) return 'age-14'
  if (faixaEtaria <= 16) return 'age-16'

  return 'age-18'
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

.movie-rating {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  color: #92400e;
  font-weight: 700;
  background-color: #fffbeb;
  border-radius: 6px;
  box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);
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
  color: #6b7280;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .movie-card {
    flex-direction: column;
  }

  .movie-card img {
    width: 100%;
    height: 260px;
  }

  .movie-card button {
    width: 100%;
  }
}

</style>
