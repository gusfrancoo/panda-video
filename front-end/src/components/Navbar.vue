<template>
  <v-app-bar app color="primary" dark>
    <v-container>
      <v-row class="d-flex">
        <v-toolbar-title>Panda Video</v-toolbar-title>
        <v-spacer />
        <v-btn text to="/home">Home</v-btn>
        <v-btn append-icon="mdi-logout" text @click="onLogout">Logout</v-btn>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  // import { logout } from '@/api/auth.api'

  const router = useRouter()

  async function onLogout () {
    localStorage.removeItem('token')
    router.push('/login')
  }
</script>
