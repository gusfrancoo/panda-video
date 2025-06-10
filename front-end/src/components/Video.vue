<template>
  <v-overlay :value="isLoading">
    <v-progress-circular indeterminate size="64" />
  </v-overlay>
  <v-card class="mt-5">
    <v-card-text>

      <!-- Player e Título dividem a mesma linha -->
      <v-row align="end" class=" items-center">
        <!-- Player ocupa metade -->
        <v-col cols="12" md="5">
          <v-responsive aspect-ratio="16/9">
            <iframe
              allowfullscreen
              frameborder="0"
              :src="video.video_player"
              style="width:100%; height:200px;"
            />
          </v-responsive>
        </v-col>

        <!-- Título ocupa a outra metade -->
        <v-col class="d-flex h-100 justify-end items-end">
          <v-text-field
            v-model="video.title"
            class="w-100"
            dense
            label="Título"
            outlined
          />
        </v-col>
      </v-row>

      <!-- Descrição em linha única -->
      <v-row class="mb-4">
        <v-col cols="12">
          <v-textarea
            v-model="video.description"
            class="w-100"
            dense
            label="Descrição"
            outlined
            rows="3"
            variant="filled"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="1"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-timer</v-icon>
            <span class="subtitle-2 font-weight-bold">Duração:</span>
          </div>
          <div class="body-2">{{ formatLength(video.length) }}</div>
        </v-col>

        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="2"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-database</v-icon>
            <span class="subtitle-2 font-weight-bold">Tamanho:</span>
          </div>
          <div class="body-2">{{ formatSize(video.storage_size) }}</div>
        </v-col>

        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="2"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-calendar</v-icon>
            <span class="subtitle-2 font-weight-bold">Criado em:</span>
          </div>
          <div class="body-2">{{ formatDate(video.created_at) }}</div>
        </v-col>

        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="2"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-calendar</v-icon>
            <span class="subtitle-2 font-weight-bold">Alterado em:</span>
          </div>
          <div class="body-2">{{ formatDate(video.updated_at) }}</div>
        </v-col>
      </v-row>

    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="grey-darken-4" prepend-icon="mdi-content-save" variant="flat" @click="updateVideos">
        Salvar
      </v-btn>
    </v-card-actions>
  </v-card>

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
</template>

<script setup>
  import { update } from '@/api/videos.api'
  import { formatDate } from '@/utils/utils'

  const props = defineProps({ video: Object })
  const emit = defineEmits(['save'])
  const isLoading = ref(false)
  const video = ref({ ...props.video })
  const showError = ref(false)
  const errorMessage = ref('')

  function formatLength (sec) {
    const s = Number(sec)
    if (Number.isNaN(s)) return '–'
    const m = String(Math.floor(s / 60)).padStart(2, '0')
    const ss = String(Math.floor(s % 60)).padStart(2, '0')
    return `${m}:${ss}`
  }
  function formatSize (bytes) {
    const n = Number(bytes)
    if (Number.isNaN(n)) return '–'
    return `${(n / 1024 / 1024).toFixed(1)} MB`
  }

  async function updateVideos () {
    try {
      const params = {
        title: video.value.title,
        description: video.value.description,
        folder_id: video.value.folder_id,
      }
      console.log('update')
      const { data } = await update(video.value.id, {
        params: params,
      })
    } catch (error) {
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao salvar os dados do video. Tente novamente.'
      showError.value = true
    }
  }
</script>
