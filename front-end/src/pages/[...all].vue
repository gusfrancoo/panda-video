<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-5 text-center elevation-2 rounded">
      <v-col class="py-5">
        <v-icon color="grey-darken-2" size="64">mdi-alert-circle-outline</v-icon>
        <h2>Página não encontrada</h2>
      </v-col>
      <v-btn color="primary" @click="$router.push('/home')">
        Voltar para Home
      </v-btn>
    </v-card>
  </v-container>
</template>
