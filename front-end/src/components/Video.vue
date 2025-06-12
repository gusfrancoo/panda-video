<template>
  <v-card class="mt-1 elevation-2 rounded" style="position: relative;">
    <v-overlay
      v-model="isLoading"
      absolute
      class="d-flex align-center justify-center"
      opacity="0.7"
    >
      <v-progress-circular color="white" indeterminate size="64" />
    </v-overlay>
    <v-card-text>

      <v-row align="end" class=" items-center">
        <v-col cols="12" md="5">
          <v-responsive v-if="!isVideoLoading" aspect-ratio="16/9" class="">
            <iframe
              allowfullscreen
              class="elevation-2 rounded"
              frameborder="0"
              :src="video.video_player"
              style="width:100%; height:200px;"
              @load="onIframeLoad"
            />
          </v-responsive>
          <div v-else>
            <div class="d-flex justify-center py-2">
              <v-progress-circular color="black" indeterminate size="64" />
            </div>
          </div>
        </v-col>

        <v-col class="d-flex h-100 justify-end items-end">
          <v-text-field
            v-model="video.title"
            dense
            label="Título"
            outlined
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row class="py-3">
        <v-col cols="12">
          <v-textarea
            v-model="video.description"
            dense
            label="Descrição"
            outlined
            rows="3"
            variant="solo-filled"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="12"
          md="3"
          sm="6"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-timer</v-icon>
            <span class="subtitle-2 font-weight-bold">Duração:</span>
          </div>
          <div class="body-2">{{ formatLength(video.length) }}</div>
        </v-col>

        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="12"
          md="3"
          sm="6"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-database</v-icon>
            <span class="subtitle-2 font-weight-bold">Tamanho:</span>
          </div>
          <div class="body-2">{{ formatSize(video.storage_size) }}</div>
        </v-col>

        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="12"
          md="3"
          sm="6"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-calendar</v-icon>
            <span class="subtitle-2 font-weight-bold">Criado em:</span>
          </div>
          <div class="body-2">{{ formatDate(video.created_at) }}</div>
        </v-col>

        <v-col
          class="pa-0 d-flex flex-column align-center"
          cols="12"
          md="3"
          sm="6"
        >
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-calendar</v-icon>
            <span class="subtitle-2 font-weight-bold">Alterado em:</span>
          </div>
          <div class="body-2">{{ formatDate(video.updated_at) }}</div>
        </v-col>
      </v-row>

    </v-card-text>

    <v-card-actions class="justify-end pa-4">
      <v-spacer />
      <v-btn
        color="grey-darken-4"
        elevation="2"
        prepend-icon="mdi-content-save"
        variant="flat"
        @click="updateVideos"
      >
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
  import { formatDate, formatLength, formatSize } from '@/utils/utils'

  const props = defineProps({ video: Object })
  const emit = defineEmits(['save'])
  const isLoading = ref(false)
  const video = ref({ ...props.video })
  const showError = ref(false)
  const errorMessage = ref('')
  const isVideoLoading = ref(false)

  function onIframeLoad () {
    isVideoLoading.value = false
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

      emit('save', { params: params, videoId: video.value.id })
    } catch (error) {
      isLoading.value = false
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao salvar os dados do video. Tente novamente.'
      showError.value = true
    } finally {
      isLoading.value = false
    }
  }
</script>
