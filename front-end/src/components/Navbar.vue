<template>
  <v-app-bar app color="grey-darken-4" elevation="0">
    <v-container>
      <v-row class="d-flex flex-wrap align-center justify-space-between">
        <v-toolbar-title class="cursor-pointer" @click="reload()">Panda Video</v-toolbar-title>

        <v-tabs v-model="currentTab">
          <v-tab
            class="mx-2"
            text
            to="/home"
            value="/home"
            @click="reload"
          >
            Home
          </v-tab>
          <v-tab
            class="mx-2"
            text
            value="/logout"
            @click="onLogout"
          >
            Logout
            <v-icon class="ms-1" right>mdi-logout</v-icon>
          </v-tab>
        </v-tabs>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script setup>
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  const currentTab = computed(() => {
    return route.path === '/home' ? '/home' : null
  })

  async function reload () {
    router.replace('/home').then(() => {
      window.location.reload()
    })
  }

  async function onLogout () {
    localStorage.clear()
    router.push('/login')
  }
</script>
