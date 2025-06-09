<template>
  <v-container class="h-100">
    <v-row class="pt-6">
      <!-- Breadcrumb + Busca -->
      <v-breadcrumbs class="mb-4 elevation-2 rounded w-100 cursor-pointer " divider=">" :items="breadcrumbs" style="user-select: none;">
        <template #item="{ item }">
          <v-breadcrumbs-item
            :disabled="!item.clickable"
            @click="() => item.onClick && item.onClick()"
          >
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

    </v-row>
    <v-row class="px-8 py-5">
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        class="w-50"
        color="grey lighten-2"
        density="comfortable"
        label="Buscar vídeos"
        variant="underlined"
      />

    </v-row>

    <v-data-table
      class="elevation-2 rounded hover:cursor-pointer"
      :columns="columns"
      dense
      :fixed-header="true"
      :hover="true"
      item-key="id"
      :items="filteredItems"
      :loading="isLoading"
    >
      <template #item.name="{ item }">
        <div v-if="item.isFolder" class="d-flex align-center" style="max-width: 200px;" @click="enterFolder(item)">
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
    </v-data-table>
  </v-container>
</template>

<script setup>
  import { getVideos } from '@/api/videos.api'

  const showError = ref(false)
  const errorMessage = ref('')
  const params = ref({}) // recebe os parametros de busca
  const videos = ref([])
  const currentFolder = ref('')
  const search = ref('')
  const isLoading = ref(false)

  const columns = [
    { title: 'Nome', key: 'name', sortable: true },
    { title: 'Tamanho', key: 'storage_size', sortable: true, align: 'right' },
    { title: 'Duração', key: 'length', sortable: true, align: 'right' },
    { title: 'Modificação', key: 'created_at', sortable: true },
  ]

  onMounted (async () => {
    isLoading.value = true
    await fetchVideos()
    isLoading.value = false
  })

  async function fetchVideos () {
    try {
      const { data } = await getVideos({
        params: params.value,
      })
      videos.value = data.videos
    } catch (error) {
      if (error.response?.status === 401) {
        // opcional: limpa o token do localStorage/sessionStorage
        localStorage.removeItem('token')
        router.push({ name: 'Login' }) // ou '/login'
        return
      }
      errorMessage.value = error.response?.data?.error || 'Ocorreu um erro ao buscar os videos. Tente novamente.'
      showError.value = true
    }
  }

  const tableItems = computed(() => {
    // agrupa por pasta
    const folders = {}
    const solos = []
    for (const v of videos.value) {
      if (v.folder_id) {
        if (!folders[v.folder_id]) {
          folders[v.folder_id] = {
            id: v.folder_id,
            name: `Pasta ${v.folder_id}`, // ou pegue nome real
            isFolder: true,
            count: 0,
          }
        }
        folders[v.folder_id].count++
      } else {
        solos.push({ ...v, isFolder: false })
      }
    }

    // se estamos na pasta X, mostramos só os vídeos dela
    if (currentFolder.value) {
      return videos.value
        .filter(v => v.folder_id === currentFolder.value)
        .map(v => ({ ...v, isFolder: false }))
    }

    // nível raiz: todas as pastas + vídeos solos
    return [
      ...Object.values(folders),
      ...solos,
    ]
  })

  const filteredItems = computed(() => {
    // if (!search.value) return tableItems.value
    return tableItems.value.filter(item => {
      const txt = item.isFolder ? item.name : item.title
      return txt.toLowerCase().includes(search.value.toLowerCase())
    })
  })

  const breadcrumbs = computed(() => {
    const bc = [
      {
        text: 'Home',
        clickable: currentFolder.value !== null,
        onClick: () => (currentFolder.value = null),
      },
    ]
    if (currentFolder.value) {
      bc.push({
        text: 'Sub - Pasta',
        clickable: true,
        // onClick: () => {  }
      })
    }
    return bc
  })

  function enterFolder (folder) {
    currentFolder.value = folder.id
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
