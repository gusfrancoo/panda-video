<template>
  <v-container class="fill-height">
    <v-overlay
      v-model="isLoading"
      absolute
      class="d-flex align-center justify-center"
      opacity="0.7"
    >
      <v-progress-circular color="white" indeterminate size="64" />
    </v-overlay>

    <v-row align="center" justify="center">
      <v-col cols="12" md="4" sm="8">
        <v-card class="elevation-3">
          <v-card-title class="justify-center d-flex text-center pa-10">
            <span class="text-h5 text-grey-darken-2">Entrar</span>
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                color="grey lighten-2"
                density="comfortable"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                required
                type="email"
                variant="outlined"
              />
              <v-text-field
                v-model="password"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                required
                type="password"
                variant="outlined"
              />
              <v-btn
                block
                class="mt-4"
                color="primary"
                :disabled="isLoading"
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

    <v-snackbar
      v-model="showError"
      color="error"
      :timeout="4000"
      top
    >
      {{ errorMessage }}
      <template #actions>
        <v-btn text @click="showError = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { login } from '@/api/auth.api'

  const email = ref('')
  const password = ref('')
  const router = useRouter()
  const showError = ref(false)
  const errorMessage = ref('')
  const isLoading = ref(false)

  async function onSubmit () {
    try {
      isLoading.value = true
      const { data } = await login({
        email: email.value,
        password: password.value,
      })
      localStorage.setItem('token', data.token)
      router.push('/home')
    } catch (error) {
      isLoading.value = false
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao fazer login. Tente novamente.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }
</script>
