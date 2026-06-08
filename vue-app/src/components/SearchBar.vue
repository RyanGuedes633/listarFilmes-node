<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  buscar: [valor: string, modo: 'series' | 'atores']
}>()

const modo = ref<'series' | 'atores'>('series')
const valor = ref('')

function onInput(e: Event) {
  valor.value = (e.target as HTMLInputElement).value
  emit('buscar', valor.value, modo.value)
}

function setModo(novoModo: 'series' | 'atores') {
  modo.value = novoModo
  emit('buscar', valor.value, modo.value)
}
</script>

<template>
  <div class="search-wrapper">
    <div class="toggle-group">
      <button
          :class="['toggle-btn', { active: modo === 'series' }]"
          @click="setModo('series')"
      >
        Séries
      </button>
      <button
          :class="['toggle-btn', { active: modo === 'atores' }]"
          @click="setModo('atores')"
      >
        Atores
      </button>
    </div>

    <input
        class="search-input"
        type="text"
        :placeholder="modo === 'series' ? 'Buscar séries...' : 'Buscar por ator...'"
        v-model="valor"
        @input="onInput"
    />
  </div>
</template>

<style scoped>
.search-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem auto;
}

.toggle-group {
  display: flex;
  border: 2px solid #015C91;
  border-radius: 16px;
  overflow: hidden;
}

.toggle-btn {
  padding: 0.25rem 1rem;
  border: none;
  background: white;
  color: #015C91;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.toggle-btn.active {
  background: #015C91;
  color: white;
}

.search-input {
  background-color: white;
  width: 30%;
  border: 2px solid #015C91;
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
}
</style>