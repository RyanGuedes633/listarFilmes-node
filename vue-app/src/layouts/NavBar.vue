<template>
  <button
    type="button"
    @click="toggle"
    class="fixed top-3 left-3 z-[1100] w-11 h-11 rounded-[12px] bg-[#015C91] shadow-[0_2px_10px_rgba(0,0,0,0.12)] hidden items-center justify-center flex-col gap-[5px] cursor-pointer border-0 max-[600px]:flex min-[981px]:hidden"
  >
    <span class="block w-[18px] h-[2px] rounded-[2px] bg-[#88CDF6]"></span>
    <span class="block w-[18px] h-[2px] rounded-[2px] bg-[#88CDF6]"></span>
    <span class="block w-[18px] h-[2px] rounded-[2px] bg-[#88CDF6]"></span>
  </button>

  <nav
    :class="[
      // base fixed top bar
      'fixed top-0 left-0 w-full flex flex-row items-center gap-3 bg-[#015C91] shadow-[0_2px_10px_rgba(0,0,0,0.12)] z-[1000] transition-all duration-200',
      'py-[0.9rem] px-[1.25rem]',
      // mobile (<=600px): column, hidden by default, shown when isOpen
      'max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-[0.45rem] max-[600px]:pt-[4.25rem]',
      isOpen
        ? 'max-[600px]:translate-y-0 max-[600px]:opacity-100 max-[600px]:pointer-events-auto'
        : 'max-[600px]:-translate-y-[110%] max-[600px]:opacity-0 max-[600px]:pointer-events-none',
      // desktop largo (>=981px): sidebar à esquerda
      'min-[981px]:h-screen min-[981px]:w-[260px] min-[981px]:flex-col min-[981px]:items-start min-[981px]:gap-3 min-[981px]:py-5 min-[981px]:px-4'
    ]"
  >
    <!-- Links da navegação para usuários logados -->
    <div v-if="user" class="flex flex-row items-center gap-1 min-[981px]:flex-col min-[981px]:items-start min-[981px]:gap-3 max-[600px]:flex-col max-[600px]:items-start w-auto min-[981px]:w-full max-[600px]:w-full">
      <router-link
        to="/"
        class="text-[#CDEAFE] hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-left w-full"
        active-class="bg-white/20 text-white font-semibold"
        @click="close"
      >
        Series Populares (TMDB)
      </router-link>
      <router-link
        to="/series"
        class="text-[#CDEAFE] hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-left w-full"
        active-class="bg-white/20 text-white font-semibold"
        @click="close"
      >
        Minhas Séries
      </router-link>
      <router-link
        to="/criar-serie"
        class="text-[#CDEAFE] hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-left w-full"
        active-class="bg-white/20 text-white font-semibold"
        @click="close"
      >
        Criar Série
      </router-link>
      <router-link
        to="/criar-ator"
        class="text-[#CDEAFE] hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium text-left w-full"
        active-class="bg-white/20 text-white font-semibold"
        @click="close"
      >
        Criar ator
      </router-link>
    </div>

    <!-- Área de perfil e logout -->
    <div class="mt-1 ml-auto flex items-center gap-3 max-[600px]:ml-0 min-[981px]:ml-0 min-[981px]:mt-auto min-[981px]:border-t min-[981px]:border-[#CDEAFE]/20 min-[981px]:pt-4 min-[981px]:w-full min-[981px]:flex-col min-[981px]:items-start">
      <span v-if="user" class="text-[#CDEAFE] text-sm whitespace-nowrap">Bem-vindo, <strong>{{ user.name }}</strong></span>

      <button v-if="user"
        type="button"
        @click="handleLogout"
        class="text-[#015C91] bg-[#88CDF6] font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-white hover:text-[#015C91] border-0 cursor-pointer min-[981px]:w-full"
      >Sair</button>

      <template v-else>
        <router-link
          to="/login"
          class="text-[#015C91] bg-[#88CDF6] no-underline font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-white hover:text-[#015C91]"
          exact-active-class="bg-white text-[#015C91] font-semibold"
        >Entrar</router-link>
        <router-link
          to="/cadastro"
          class="text-white bg-[#0EA5E9] no-underline font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-[#0284C7]"
          exact-active-class="bg-[#0284C7] text-white font-semibold"
        >Cadastrar</router-link>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../stores/auth.js'

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}

const router = useRouter()
const { user, logout } = useAuth()

function handleLogout() {
  logout()
  router.push({ name: 'login' })
}
</script>
