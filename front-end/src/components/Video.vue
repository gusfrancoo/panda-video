<template>
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
          />
        </v-col>
      </v-row>

      <!-- Informações inline em duas colunas -->
      <v-row dense>
        <v-col class="pa-0" cols="6">
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-timer</v-icon>
            <span class="subtitle-2">Duração:</span>
          </div>
          <div class="body-2">{{ formatLength(video.length) }}</div>
        </v-col>
        <v-col class="pa-0" cols="6">
          <div class="d-flex align-center">
            <v-icon class="mr-1" small>mdi-database</v-icon>
            <span class="subtitle-2">Tamanho:</span>
          </div>
          <div class="body-2">{{ formatSize(video.storage_size) }}</div>
        </v-col>
      </v-row>

    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="onSave">Salvar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  const props = defineProps({ video: Object })
  const emit = defineEmits(['save'])

  const video = ref({ ...props.video })

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

  function onSave () {
    emit('save', props.video)
  }
</script>
