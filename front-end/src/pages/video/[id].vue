<template>
  <v-container class=" relative">
    <div class="d-flex justify-center">
      <v-card class="pa-8 rounded-lg w-100" max-width="1200px" style="box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);">

        <div class="mb-4">
          <v-btn
            class="text-capitalize"
            color="grey-darken-4"
            elevation="2"
            prepend-icon="mdi-arrow-left"
            variant="elevated"
            @click="backButton"
          >
            Voltar para Home
          </v-btn>
        </div>

        <div class="w-100 d-flex justify-center mb-6 items-center">
          <div class="player-container mb-4 mb-md-0">
            <iframe
              :src="video.video_player"
              title="Player de Vídeo"
            />
          </div>

        </div>
        <v-divider class="my-6" />
        <v-row class="align-center justify-space-between mb-4">
          <v-col cols="10">
            <v-expand-transition>
              <div v-if="!isEditing" class="text-h5 font-weight-bold">
                {{ video.title || 'Sem título' }}
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <v-text-field
                v-if="isEditing"
                v-model="titleEdited"
                class="mt-1"
                density="compact"
                hide-details
                label="Título"
                variant="solo-filled"
              />
            </v-expand-transition>
          </v-col>
          <v-col v-if="!isEditing" class="text-right" cols="2">
            <v-btn
              class="text-white"
              color="blue-accent-3"
              variant="flat"
              @click="toggleEdit"
            >
              <v-icon start>mdi-pencil</v-icon>
              Editar
            </v-btn>
          </v-col>
        </v-row>
        <v-row class="mb-6">
          <v-col cols="12">
            <v-expand-transition>
              <div v-if="!isEditing" class="body-1">
                {{ video.description || 'Sem descrição' }}
              </div>
            </v-expand-transition>
            <v-expand-transition>
              <v-textarea
                v-if="isEditing"
                v-model="descEdited"
                auto-grow
                class="mt-1"
                density="compact"
                hide-details
                label="Descrição"
                rows="2"
                variant="solo-filled"
              />
            </v-expand-transition>
          </v-col>
        </v-row>
        <div v-if="isEditing" class="d-flex justify-end ga-3">
          <v-btn
            color="red-darken-2"
            :disabled="isLoading"
            elevation="2"
            prepend-icon="mdi-close"
            variant="flat"
            @click="toggleEdit"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            :disabled="isLoading"
            elevation="2"
            :loading="isLoading"
            prepend-icon="mdi-content-save"
            variant="flat"
            @click="updateVideos"
          >
            Salvar Alterações
          </v-btn>
        </div>
        <v-divider class="my-6" />
        <v-card
          class="pa-6 mt-4"
          elevation="2"
          rounded="lg"
          style="background-color: #fafafa;"
        >
          <v-card-title class="text-subtitle-1 font-weight-medium text-black mb-3">
            Informações Técnicas
          </v-card-title>

          <v-row class="mb-4" dense>
            <v-col cols="12" md="4">
              <v-list-item>
                <v-list-item-title class="text-subtitle-2">Resolução Original</v-list-item-title>
                <v-list-item-subtitle>{{ video.width }} x {{ video.height }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12" md="4">
              <v-list-item>
                <v-list-item-title class="text-subtitle-2">Extensão</v-list-item-title>
                <v-list-item-subtitle>{{ getExtension(video.title) }}</v-list-item-subtitle>
              </v-list-item>
            </v-col>
            <v-col cols="12" md="4">
              <v-list-item>
                <v-list-item-title class="text-subtitle-2">Resoluções Disponíveis</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    v-for="res in video.playback"
                    :key="res"
                    class="ma-1"
                    color="purple"
                    label
                    size="small"
                  >
                    {{ res }}
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-col>
          </v-row>

          <v-divider class="my-3" />

          <v-row dense>
            <v-col cols="12" md="3" sm="6">
              <v-icon class="mr-1" size="18">mdi-timer</v-icon>
              <strong>Duração:</strong> {{ formatLength(video.length) }}
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-icon class="mr-1" size="18">mdi-database</v-icon>
              <strong>Tamanho:</strong> {{ formatSize(video.storage_size) }}
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-icon class="mr-1" size="18">mdi-calendar</v-icon>
              <strong>Criado:</strong> {{ formatDate(video.created_at) }}
            </v-col>
            <v-col cols="12" md="3" sm="6">
              <v-icon class="mr-1" size="18">mdi-calendar-refresh</v-icon>
              <strong>Atualizado:</strong> {{ formatDate(video.updated_at) }}
            </v-col>
          </v-row>
        </v-card>

      </v-card>
    </div>

    <v-snackbar
      v-model="showError"
      color="error"
      :timeout="2000"
      top
    >
      {{ errorMessage }}
      <template #actions>
        <v-btn text @click="showError = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
  import { useRoute, useRouter } from 'vue-router'
  import { getVideo, update } from '@/api/videos.api'
  import { formatDate, formatLength, formatSize } from '@/utils/utils'

  const isLoading = ref(false)
  const video = ref({})
  const showError = ref(false)
  const errorMessage = ref('')
  const isEditing = ref(false)
  const titleEdited = ref('')
  const descEdited = ref('')
  const route = useRoute()
  const router = useRouter()
  const videoId = route.params.id

  onMounted(async () => {
    await fetchVideoDetails()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })

  async function fetchVideoDetails () {
    try {
      const { data } = await getVideo(videoId)
      video.value = data
    } catch (error) {
      isLoading.value = false
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao salvar os dados do video. Tente novamente.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }

  async function updateVideos () {
    const title = titleEdited?.value.trim()
    const description = descEdited.value ? descEdited.value.trim() : ''
    const folderId = video.value.folder_id

    if (!title) {
      errorMessage.value = 'O título não pode estar vazio.'
      showError.value = true
      return
    }

    const sameTitle = title === video.value.title?.trim()
    const sameDesc = description === video.value.description?.trim()
    if (sameTitle && sameDesc) {
      isEditing.value = false
      return
    }

    try {
      isLoading.value = true
      const params = { title, description, folder_id: folderId }

      const response = await update(video.value.id, { params })
      video.value = response.data
      isEditing.value = false
    } catch (error) {
      errorMessage.value = error.response?.data?.error || 'Erro ao salvar os dados.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }

  function backButton () {
    router.back()
  }

  function toggleEdit () {
    isEditing.value = !isEditing.value
    if (isEditing) {
      titleEdited.value = video.value.title
      descEdited.value = video.value.description
    }
  }

  function getExtension (name) {
    if (!name || typeof name !== 'string') return ''

    const parts = name.split('.')

    // Arquivos sem extensão
    if (parts.length <= 1) return ''

    return parts.pop().toLowerCase() // pega a última parte e normaliza
  }

</script>
<style scoped>
.player-container {
  width: 100%;
  max-width: 640px;
  aspect-ratio: 12 / 6;
  border-radius: 12px;
  overflow: hidden;
  background-color: #000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  margin: 0 auto;
}

.player-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
