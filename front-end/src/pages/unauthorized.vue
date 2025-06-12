<template>
  <v-main
    class="fill-height d-flex align-center justify-center"
    style="background: linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)"
  >
    <v-card class="elevation-12" outlined>

      <v-card-title class="headline text-center pt-6">
        <v-row class="d-flex flex-column align-center">
          <v-col class="text-center" cols="auto">
            <v-icon color="warning" size="64">mdi-lock-alert</v-icon>
            <div class="headline mt-2">Acesso Não Autorizado</div>
          </v-col>
        </v-row>
      </v-card-title>

      <v-card-text class="text-center">
        <p class="mt-4 mb-0">
          Você não tem permissão para acessar este conteúdo.
        </p>
      </v-card-text>

      <v-card-actions class="justify-center pb-6">
        <v-btn color="primary" dark @click="$router.replace('/login')">
          Ir para Login
        </v-btn>
      </v-card-actions>

    </v-card>
  </v-main>
</template>

<style scoped>
.v-card {
  border-radius: 16px;
}
</style>
