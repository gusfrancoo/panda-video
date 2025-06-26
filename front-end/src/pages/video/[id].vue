<template>
  <v-container class="mt-5">
    <div class="d-flex justify-center">
      <v-card class="pa-8 rounded-lg w-100" max-width="1200px" style="box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);">
        <v-overlay
          v-model="isLoading"
          absolute
          class="d-flex align-center justify-center"
          opacity="0.7"
        >
          <v-progress-circular color="white" indeterminate size="64" />
        </v-overlay>

        <!-- PLAYER + THUMBNAIL -->
        <div class="w-100 d-flex justify-center mb-6 items-center">
          <div class="player-container mb-4 mb-md-0">
            <iframe
              :src="video.video_player"
              title="Player de Vídeo"
            />
          </div>

        </div>

        <!-- TÍTULO E EDIÇÃO -->
        <v-row class="align-center justify-space-between mb-4">
          <v-col cols="10">
            <div v-if="!isEditing" class="text-h5 font-weight-bold">
              {{ video.title || 'Sem título' }}
            </div>
            <v-text-field
              v-else
              v-model="video.title"
              dense
              label="Título"
              outlined
              variant="solo-filled"
            />
          </v-col>
          <v-col class="text-right" cols="2">
            <v-btn
              :color="isEditing ? 'red-darken-2' : 'primary'"
              variant="flat"
              @click="toggleEdit"
            >
              <v-icon start>{{ isEditing ? 'mdi-close' : 'mdi-pencil' }}</v-icon>
              {{ isEditing ? 'Cancelar' : 'Editar' }}
            </v-btn>
          </v-col>
        </v-row>

        <!-- DESCRIÇÃO -->
        <v-row class="mb-6">
          <v-col cols="12">
            <div v-if="!isEditing" class="body-1">
              {{ video.description || 'Sem descrição' }}
            </div>
            <v-textarea
              v-else
              v-model="video.description"
              dense
              label="Descrição"
              outlined
              rows="3"
              variant="solo-filled"
            />
          </v-col>
        </v-row>

        <!-- DADOS AVANÇADOS -->
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
              <v-list-item-subtitle>{{ video.extension }}</v-list-item-subtitle>
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
                  color="primary"
                  label
                  size="small"
                >
                  {{ res }}
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>

        <!-- METADADOS -->
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

        <!-- AÇÕES -->
        <v-card-actions v-if="isEditing" class="justify-end pa-4">
          <v-btn
            color="success"
            elevation="2"
            prepend-icon="mdi-content-save"
            variant="flat"
            @click="updateVideos"
          >
            Salvar Alterações
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>

    <!-- SNACKBAR -->
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
  import { useRoute } from 'vue-router'
  import { getVideo, update } from '@/api/videos.api'
  import { formatDate, formatLength, formatSize } from '@/utils/utils'

  const emit = defineEmits(['save'])
  const isLoading = ref(false)
  const video = ref({})
  const showError = ref(false)
  const errorMessage = ref('')
  const isEditing = ref(false)

  const route = useRoute()
  const videoId = route.params.id

  onMounted(async () => {
    await fetchVideoDetails()
  })

  async function fetchVideoDetails () {
    try {
      // isLoading.value = true
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
    try {
      isLoading.value = true
      const params = {
        title: video.value.title,
        description: video.value.description,
        folder_id: video.value.folder_id,
      }

      await update(video.value.id, {
        params: params,
      })

      // emit('save', { params: params, videoId: video.value.id })
    } catch (error) {
      isLoading.value = false
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao salvar os dados do video. Tente novamente.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }

  function toggleEdit () {
    isEditing.value = !isEditing.value
  }
</script>
<style scoped>
.player-container {
  width: 100%;
  max-width: 640px; /* ou 600px para menor ainda */
  aspect-ratio: 16 / 9;
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
