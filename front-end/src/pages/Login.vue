<template>
  <v-container class="fill-height ">
    <v-row align="center" justify="center">
      <v-col cols="12" md="4" sm="8">
        <v-card class="elevation-3">
          <v-card-title class="justify-center d-flex text-center pa-10">
            <span class="text-h5 ">Entrar</span>
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
                prepend-inner-icon="mdi-lock"
                required
                type="password"
              />
              <v-btn
                block
                class="mt-4"
                color="primary"
                prepend-icon="mdi-login"
                type="submit"
              >
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

  function onSubmit () {
    router.push('/home')
  }
</script>
