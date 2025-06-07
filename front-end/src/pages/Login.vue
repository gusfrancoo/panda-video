<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center" >
      <v-col cols="12" sm="8" md="4" >
        <v-card class="elevation-3">
        
          <v-card-title class="justify-center">
            <span class="text-h5">Entrar</span>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                required
              />
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                prepend-inner-icon="mdi-lock"
                required
              />
              <v-btn class="mt-4" type="submit" block color="primary">
                Login
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()

function onSubmit() {
  // por enquanto só redireciona, depois integraremos com auth.service.login()
  router.push('/home')
}
</script>
