<template>
  <v-app-bar app color="grey-darken-4" dark>
    <v-container>
      <v-row class="d-flex align-center">
        <v-toolbar-title>Panda Video</v-toolbar-title>
        <v-spacer />
        <v-tabs>
          <v-tab
            class="mx-2"
            text
            to="/home"
          >
            Home
          </v-tab>
          <v-tab
            class="mx-2"
            text
            @click="onLogout"
          >
            Logout
            <v-icon class="px-5" right>mdi-logout</v-icon>
          </v-tab>
        </v-tabs>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()

  async function onLogout () {
    localStorage.removeItem('token')
    router.push('/login')
  }
</script>
