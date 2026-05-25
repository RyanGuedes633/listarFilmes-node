<template>
    <nav style="display:flex; gap:.5rem; margin-top:.75rem;">
      <router-link to="/" style="text-decoration:none;">Início</router-link>
      <router-link to="/series" style="text-decoration:none;">Minhas Séries</router-link>
      <router-link to="/criar-serie" style="text-decoration:none;">Criar Série</router-link>
      <router-link to="/criar-ator" style="text-decoration:none;">Criar Ator</router-link>
    </nav>
</template>

<script setup>

</script>

<style scoped>
    nav a.router-link-active { 
        font-weight: 600; 
    }

    nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        display: flex;
        gap: .75rem;
        align-items: center;
        padding: .9rem 1.25rem;
        background: #015C91;
        box-shadow: 0 2px 10px rgba(0, 0, 0, .12);
        z-index: 1000;
    }

    nav a {
        color: #88CDF6;
        text-decoration: none;
        font-weight: 500;
        padding: .35rem .6rem;
        border-radius: .4rem;
        transition: background .2s ease, color .2s ease;
    }

    nav a:hover {
        background: #2C82B5;
        color: white;
    }

    nav a.router-link-active {
        background: #2C82B5;
        color: white;
    }
</style>
