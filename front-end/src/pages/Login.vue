<template>
  <v-container class="fill-height">

    <v-row align="center" justify="center">
      <v-col cols="12" md="4" sm="8">
        <v-card
          class="elevation-6 rounded-lg py-10 px-6 bg-white mx-auto"
          max-width="400"
        >
          <v-card-title class="justify-center d-flex text-center mb-6">
            <span class="text-h4 text-grey-darken-2">Entrar</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="formRef" v-model="formIsValid" @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                density="compact"
                label="E-mail"
                prepend-inner-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                type="email"
                variant="outlined"
              />
              <v-text-field
                v-model="password"
                class="mt-4"
                density="compact"
                label="Senha"
                prepend-inner-icon="mdi-lock"
                :rules="[rules.required, rules.minPassword]"
                type="password"
                variant="outlined"
              />

              <v-btn
                append-icon="mdi-login"
                block
                class="mt-4"
                color="primary"
                :disabled="!formIsValid || isLoading"
                :loading="isLoading"
                type="submit"
              >
                Login
              </v-btn>

              <div v-if="showError" class="text-error text-sm mt-3 text-center">
                {{ errorMessage }}
              </div>
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
  import { login } from '@/api/auth.api'

  const email = ref('')
  const password = ref('')
  const showError = ref(false)
  const errorMessage = ref('')
  const isLoading = ref(false)
  const formRef = ref(null)
  const formIsValid = ref(false)
  const router = useRouter()

  const rules = {
    required: v => !!v || 'Campo obrigatório',
    email: v => /.+@.+\..+/.test(v) || 'E-mail inválido',
    minPassword: v => (v && v.length >= 6) || 'Mínimo 6 caracteres',
  }

  async function onSubmit () {
    const { valid } = await formRef.value.validate()
    if (!valid) return

    isLoading.value = true
    showError.value = false

    try {
      const { data } = await login({
        email: email.value,
        password: password.value,
      })
      localStorage.setItem('token', data.token)
      router.push('/home')
    } catch (error) {
      errorMessage.value
        = error.response?.data?.error || 'Erro ao fazer login. Tente novamente.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }
</script>
