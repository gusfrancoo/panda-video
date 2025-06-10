<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 text-center">
      <v-icon color="grey lighten-1" size="64">mdi-lock-outline</v-icon>
      <h2>Acesso negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <v-btn color="primary" @click="$router.push('/login')">
        Fazer login
      </v-btn>
    </v-card>
  </v-container>
</template>
