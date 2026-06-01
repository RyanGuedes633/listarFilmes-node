<script setup lang="ts">
const emit = defineEmits<{ buscar: [valor: string] }>()
</script>

<template>
  <div class="search-wrapper">
    <input
        class="search-input"
        type="text"
        placeholder="Buscar Séries."
        @input="emit('buscar', ($event.target as HTMLInputElement).value)"
    />

  </div>
</template>
<style scoped>
.search-input{
  background-color: white;
  width: 30%;
  margin: 1rem auto;
  border: 2px solid #015C91;
  border-radius: 16px;
  padding: 0.25rem;
  display: flex;
}
</style>

