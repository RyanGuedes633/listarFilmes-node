<template>
  <section class="login-overlay">
    <form class="login-card" @submit.prevent="enviarFormulario">
      <h1 class="login-title">
        {{ criandoConta ? 'Criar conta' : 'Fazer login' }}
      </h1>

      <label v-if="criandoConta" class="login-field">
        <span>Nome</span>
        <input type="text" placeholder="Seu nome" required>
      </label>

      <label class="login-field">
        <span>Email</span>
        <input type="email" placeholder="seu@email.com" required>
      </label>

      <label class="login-field">
        <span>Senha</span>
        <input type="password" placeholder="Sua senha" required>
      </label>

      <label v-if="criandoConta" class="login-field">
        <span>Confirmar senha</span>
        <input type="password" placeholder="Confirme sua senha" required>
      </label>

      <button class="login-button" type="submit">
        {{ criandoConta ? 'Criar conta' : 'Acessar' }}
      </button>

      <p class="login-switch-text">
        {{ criandoConta ? 'Ja tem uma conta?' : 'Ainda não tem conta?' }}

        <button class="login-switch-button" type="button" @click="alternarModo">
          {{ criandoConta ? 'Fazer login' : 'Criar conta' }}
        </button>
      </p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login-success'])

const criandoConta = ref(false)

function alternarModo() {
  criandoConta.value = !criandoConta.value
}

function enviarFormulario() {
  emit('login-success')
}
</script>
