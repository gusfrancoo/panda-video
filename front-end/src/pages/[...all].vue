<template>
  <v-main class="fill-height d-flex align-center justify-center" style="background: linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)">
    <v-card class="elevation-12" outlined>
      <v-card-title class="headline text-center pt-6">
        <v-row class="d-flex flex-column align-center">
          <v-col class="text-center" cols="auto">
            <v-icon color="error" size="64">mdi-alert-circle-outline</v-icon>
            <div class="headline mt-2">404 - Página não encontrada</div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="text-center">
        <p class="mt-4 mb-0 ">
          A página que você procura não existe ou foi movida.
        </p>
      </v-card-text>

      <v-card-actions class="justify-center pb-6">
        <v-btn color="primary" dark @click="$router.replace('/home')">
          Voltar para Home
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-main>
</template>

<style scoped>
.v-img {
  background-color: #f5f5f5;
}

.v-card {
  border-radius: 16px;
}
</style>
