<template>
  <v-container class="h-100">
    <v-row class="pt-6">
      <v-breadcrumbs
        class="mb-4 elevation-2 w-100 cursor-pointer py-3"
        divider="/"
        :items="breadcrumbs"
        rounded
        style="user-select: none; background-color: white;"
      >
        <template #item="{ item }">
          <v-breadcrumbs-item
            :disabled="!item.clickable"
            @click="() => item.onClick && item.onClick()"
          >
            <v-icon class="mr-1" small>{{ item.icon }}</v-icon>
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

    </v-row>
    <templte v-if="!showVideo" class="">
      <v-row align="center" class="px-2  d-flex justify-left">
        <v-col cols="12" lg="4" md="6">
          <v-text-field
            v-model="search"
            :clearable="true"
            density="comfortable"
            fixed-header
            placeholder="Filtre por nome de pasta ou vídeo…"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            @click:clear="search = ''"
          />
        </v-col>
      </v-row>
      <v-row class="px-5">
        <v-data-table
          v-model="selected"
          class="elevation-2 rounded"
          dense
          density="comfortable"
          :headers="columns"
          :hover="true"
          item-key="id"
          :items="filteredItems"
          :loading="isLoading"
          :row-props="rowProps"
          @click:row="(e, row) => handleRowClick(row)"
        >
          <!-- <template #top>
            <v-toolbar v-if="selected.length > 0" dense flat>
              <v-toolbar-title>{{ selected.length }} selecionado(s)</v-toolbar-title>
              <v-spacer />
              <v-btn icon @click="deleteSelected">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-toolbar>
          </template> -->

          <template #item.name="{ item }">
            <div v-if="item.isFolder" class="d-flex align-center " style="max-width: 200px;">
              <v-icon class="mr-1 " small>mdi-folder</v-icon>
              <span class=" text-truncate text-no-wrap">{{ item.name }}</span>({{ item.count }})
            </div>
            <div v-else>
              <v-icon class="mr-1" small>mdi-video</v-icon>
              {{ item.title }}
            </div>
          </template>

          <template #item.storage_size="{ item }">
            {{ formatSize(item.storage_size) }}
          </template>
          <template #item.length="{ item }">
            {{ formatLength(item.length) }}
          </template>
          <template #item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <!-- <template #item.actions="{ item }">
            <v-btn icon small variant="plain" @click="editItem(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small variant="plain" @click="deleteItem(item)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template> -->

        </v-data-table>

      </v-row>

    </templte>
    <template v-else>
      <Video
        :video="selectedVideo"
        @back="selectedVideo = null"
        @save="onSaveVideo"
      />

    </template>
  </v-container>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { getVideos } from '@/api/videos.api'
  import Video from '@/components/Video.vue'

  const router = useRouter()
  const showError = ref(false)
  const errorMessage = ref('')
  const params = ref({})
  const videos = ref([])
  const currentFolder = ref('')
  const search = ref('')
  const isLoading = ref(false)
  const selectedVideo = ref(null)
  const showVideo = ref(false)

  const columns = [
    { title: 'Nome', key: 'name', sortable: true },
    { title: 'Tamanho', key: 'storage_size', sortable: true, align: 'right' },
    { title: 'Duração', key: 'length', sortable: true, align: 'right' },
    { title: 'Modificação', key: 'created_at', sortable: true },
    // { title: 'Ações', key: 'actions', sortable: false, align: 'center' },
  ]

  onMounted (async () => {
    isLoading.value = true
    await fetchVideos()
    isLoading.value = false
  })

  function rowProps () {
    return {
      class: {
        'cursor-pointer': true,
      },
    }
  }

  async function fetchVideos () {
    try {
      const { data } = await getVideos({
        params: params.value,
      })
      videos.value = data.videos
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        router.push({ name: 'Login' })
        return
      }
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao buscar os videos. Tente novamente.'
      showError.value = true
    }
  }

  const tableItems = computed(() => {
    const folders = {}
    const solos = []
    for (const v of videos.value) {
      if (v.folder_id) {
        if (!folders[v.folder_id]) {
          folders[v.folder_id] = {
            id: v.folder_id,
            name: `Pasta ${v.folder_id}`,
            isFolder: true,
            count: 0,
          }
        }
        folders[v.folder_id].count++
      } else {
        solos.push({ ...v, isFolder: false })
      }
    }

    if (currentFolder.value) {
      return videos.value
        .filter(v => v.folder_id === currentFolder.value)
        .map(v => ({ ...v, isFolder: false }))
    }

    return [
      ...Object.values(folders),
      ...solos,
    ]
  })

  const filteredItems = computed(() => {
    return tableItems.value.filter(item => {
      const txt = item.isFolder ? item.name : item.title
      return txt.toLowerCase().includes(search.value.toLowerCase())
    })
  })

  const breadcrumbs = computed(() => {
    const bc = [
      { text: 'Home', icon: 'mdi-home', clickable: showVideo.value || (!selectedVideo.value && currentFolder.value), onClick: () => {
        showVideo.value = false
        selectedVideo.value = null
        currentFolder.value = ''
      } },
    ]
    if (!selectedVideo.value && currentFolder.value) {
      const folderName = tableItems.value.find(f => f.id === currentFolder.value)?.name
      bc.push({ text: 'Pasta', icon: 'mdi-folder', clickable: false, onClick: () => {
        currentFolder.value = ''
      } })
    }
    if (selectedVideo.value !== null) {
      console.log(selectedVideo.value)
      bc.push({ text: selectedVideo.value.title, icon: 'mdi-play-circle', clickable: false })
    }
    return bc
  })

  function enterFolder (folder) {
    currentFolder.value = folder.id
  }

  function handleRowClick ({ item }) {
    if (item.isFolder) {
      // só filtra a lista, sem mudar de rota
      enterFolder(item)
    } else {
      console.log(item)
      selectedVideo.value = item
      showVideo.value = true
    }
  }

  function formatSize (bytes) {
    const n = Number(bytes)
    if (Number.isNaN(n)) return '–'
    return `${(n / 1024 / 1024).toFixed(1)} MB`
  }

  function formatLength (sec) {
    const s = Number(sec)
    if (Number.isNaN(s)) return '–'
    const m = Math.floor(s / 60).toString().padStart(2, '0')
    const ss = Math.floor(s % 60).toString().padStart(2, '0')
    return `${m}:${ss}`
  }

  function formatDate (iso) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return '–'
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

</script>

<style scoped>
::v-deep .v-data-table__wrapper tbody tr {
  cursor: pointer;
}
</style>
