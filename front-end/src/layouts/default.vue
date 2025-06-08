<template>
  <v-main>
    <Navbar v-if="route.path !== '/login'" />
    <router-view />
  </v-main>

</template>

<script setup>
  import { useRoute } from 'vue-router'
  import Navbar from '@/components/Navbar.vue'

  const route = useRoute()
</script>
