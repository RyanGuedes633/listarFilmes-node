<template>
  <article class="flex w-40 flex-col gap-2 rounded-lg border border-[#e5e7eb] bg-white p-[0.6rem]">
    <img v-if="actor.foto" :src="actor.foto" :alt="actor.nome" class="h-45 w-full rounded-lg object-cover bg-[#f3f4f6]" />
    <div class="text-center">
      <strong>{{ actor.nome }}</strong>
      <p class="mt-1 text-[0.9rem] text-[#4b5563]">Sexo: {{ actor.sexo }}</p>
      <p class="mt-1 text-[0.9rem] text-[#4b5563]">Idade: {{ actor.idade }}</p>
    </div>
  </article>
</template>

<script setup>
defineProps({
  actor: {
    type: Object,
    required: true
  }
})
</script>