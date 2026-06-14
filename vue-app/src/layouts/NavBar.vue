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
    <router-link
      to="/"
      class="text-[#88CDF6] no-underline font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-[#2C82B5] hover:text-white max-[600px]:w-full min-[981px]:w-full min-[981px]:px-[0.6rem] min-[981px]:py-[0.45rem]"
      exact-active-class="bg-[#2C82B5] text-white font-semibold"
    >Séries Populares (TMDB)</router-link>

    <router-link
      to="/series"
      class="text-[#88CDF6] no-underline font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-[#2C82B5] hover:text-white max-[600px]:w-full min-[981px]:w-full min-[981px]:px-[0.6rem] min-[981px]:py-[0.45rem]"
      exact-active-class="bg-[#2C82B5] text-white font-semibold"
    >Minhas Séries</router-link>

    <router-link
      to="/criar-serie"
      class="text-[#88CDF6] no-underline font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-[#2C82B5] hover:text-white max-[600px]:w-full min-[981px]:w-full min-[981px]:px-[0.6rem] min-[981px]:py-[0.45rem]"
      exact-active-class="bg-[#2C82B5] text-white font-semibold"
    >Criar Série</router-link>

    <router-link
      to="/criar-ator"
      class="text-[#88CDF6] no-underline font-medium px-[0.6rem] py-[0.35rem] rounded-[0.4rem] whitespace-nowrap transition-colors hover:bg-[#2C82B5] hover:text-white max-[600px]:w-full min-[981px]:w-full min-[981px]:px-[0.6rem] min-[981px]:py-[0.45rem]"
      exact-active-class="bg-[#2C82B5] text-white font-semibold"
    >Criar Ator</router-link>
  </nav>
</template>


<script setup>
import { ref } from 'vue'

const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}

function close() {
  isOpen.value = false
}
</script>

