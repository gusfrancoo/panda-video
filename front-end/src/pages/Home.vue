<template>
  <v-container class="h-100">
    <v-row class="pt-6">
      <v-breadcrumbs
        class="mb-5 elevation-2 w-100 "
        divider="/"
        :items="breadcrumbs"
        rounded
        style="user-select: none; background-color: white;"
      >
        <template #item="{ item }">
          <v-breadcrumbs-item
            class="cursor-pointer"
            :disabled="!item.clickable"
            @click="() => item.onClick && item.onClick()"
          >
            <v-icon class="mr-1" small>{{ item.icon }}</v-icon>
            {{ item.text }}
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>

    </v-row>
    <template v-if="!showVideo">
      <v-row align="center" class="px-2  d-flex justify-left">
        <v-col cols="12" lg="4" md="6">
          <v-text-field
            v-model="search"
            :clearable="true"
            density="comfortable"
            placeholder="Filtre por nome de pasta ou vídeo…"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            @click:clear="search = ''"
          />
        </v-col>
      </v-row>
      <v-row class="px-5">
        <v-data-table
          v-model="selectedVideo"
          class="elevation-3 rounded"
          dense
          density="comfortable"
          :headers="columns"
          :hover="true"
          item-key="id"
          :items="filteredItems"
          :items-length="filteredItems.length"
          :items-per-page="itemsPerPage"
          :loading="isLoading"
          :page="page"
          :row-props="rowProps"
          @click:row="(e, row) => handleRowClick(row)"
          @update:page="val => page = val"
        >
          <template #no-data>
            <v-sheet class="pa-6 text-center">
              <v-icon color="grey lighten-1" large>mdi-video-off</v-icon>
              <p>Nenhum vídeo ou pasta para exibir.</p>
            </v-sheet>
          </template>

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
            {{ formatDate(item.updated_at) }}
          </template>

        </v-data-table>

      </v-row>

    </template>

    <template v-else>
      <Video
        :video="selectedVideo"
        @back="selectedVideo = null"
        @save="onUpdateVideo"
      />

    </template>

    <v-snackbar
      v-model="showSnack"
      :color="snackColor"
      :timeout="4000"
      top
    >
      {{ snackMessage }}
      <template #actions>
        <v-btn text @click="showSnack = false">
          Fechar
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>

</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { getFolders } from '@/api/folders.api'
  import { getVideos } from '@/api/videos.api'
  import Video from '@/components/Video.vue'
  import { formatDate, formatLength, formatSize } from '@/utils/utils'

  const router = useRouter()
  const showSnack = ref(false)
  const snackColor = ref('')
  const snackMessage = ref('')
  const videos = ref([])
  const currentFolder = ref('')
  const search = ref('')
  const isLoading = ref(false)
  const selectedVideo = ref(null)
  const showVideo = ref(false)
  const folders = ref([])
  const folderHistory = ref([])

  const cacheFolder = new Map()
  const cacheData = new Map()

  const page = ref(1)
  const itemsPerPage = ref(5)

  const columns = [
    { title: 'Nome', key: 'name', sortable: true },
    { title: 'Tamanho', key: 'storage_size', sortable: true, align: 'right' },
    { title: 'Duração', key: 'length', sortable: true, align: 'right' },
    { title: 'Modificação', key: 'created_at', sortable: true },
  ]

  onMounted (async () => {
    isLoading.value = true
    await fetchFolders()
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

  async function fetchVideos (folderId = null) {
    isLoading.value = true

    if (cacheData.has(folderId)) {
      videos.value = cacheData.get(folderId)
    } else {
      try {
        const { data } = await getVideos(folderId ? { folder_id: folderId } : {})
        const fetchedVideos = data.videos || []
        videos.value = fetchedVideos
        cacheData.set(folderId, fetchedVideos)
      } catch (error) {
        snackMessage.value = error.response?.data?.error || 'Erro ao buscar vídeos.'
        snackColor.value = 'error'
        showSnack.value = true
      }
    }

    isLoading.value = false
  }

  async function fetchFolders (parentFolderId = null) {
    isLoading.value = true

    if (cacheFolder.has(parentFolderId)) {
      folders.value = cacheFolder.get(parentFolderId)
    } else {
      try {
        const { data } = await getFolders(parentFolderId ? { parent_folder_id: parentFolderId } : {})
        const fetchedFolders = data.folders || []
        folders.value = fetchedFolders
        cacheFolder.set(parentFolderId, fetchedFolders)
      } catch (error) {
        snackMessage.value = error.response?.data?.error || 'Erro ao buscar pastas.'
        snackColor.value = 'error'
        showSnack.value = true
      }
    }

    if (parentFolderId === null) {
      folderHistory.value = []
    } else {
      const exists = folderHistory.value.find(f => f.id === parentFolderId)
      if (!exists) {
        let folderData = folders.value.find(f => f.id === parentFolderId)

        if (!folderData) {
          for (const folderList of cacheFolder.values()) {
            folderData = folderList.find(f => f.id === parentFolderId)
            if (folderData) break
          }
        }

        folderHistory.value.push({
          id: parentFolderId,
          name: folderData?.name || `Pasta ${parentFolderId}`,
        })
      }
    }

    currentFolder.value = parentFolderId
    isLoading.value = false
  }

  const tableItems = computed(() => {
    const items = []

    for (const folder of folders.value) {
      items.push({
        ...folder,
        isFolder: true,
        name: folder.name,
        count: folder.videos_count,
      })
    }

    const filteredVideos = videos.value.filter(v =>
      !currentFolder.value || v.folder_id === currentFolder.value,
    ).map(v => ({ ...v, isFolder: false }))

    return [...items, ...filteredVideos]
  })

  const filteredItems = computed(() => {
    return tableItems.value.filter(item => {
      const txt = item.isFolder ? item.name : item.title
      return txt.toLowerCase().includes(search.value.toLowerCase())
    })
  })

  const breadcrumbs = computed(() => [
    {
      text: 'Home',
      icon: 'mdi-home',
      clickable: folderHistory.value.length > 0,
      onClick: () => fetchFolders(),
    },
    ...folderHistory.value.map((folder, index) => ({
      text: folder.name,
      icon: 'mdi-folder',
      clickable: index !== folderHistory.value.length - 1, // só o último desativa
      onClick: () => {
        // Volta até aquele ponto do histórico
        const subPath = folderHistory.value.slice(0, index + 1)
        folderHistory.value = subPath
        fetchFolders(folder.id)
        fetchVideos(folder.id)
      },
    })),
  ])

  async function onUpdateVideo () {
    await fetchVideos()
    snackMessage.value = 'Vídeo atualizado com sucesso!'
    snackColor.value = 'green'
    showSnack.value = true
  }

  async function handleRowClick ({ item }) {
    if (item.isFolder) {
      await fetchFolders(item.id)
      await fetchVideos(item.id)
    } else {
      selectedVideo.value = item
      showVideo.value = true
    }
  }

  // function handleRowClick ({ item }) {
  //   if (item.isFolder) {
  //     enterFolder(item)
  //   } else {
  //     selectedVideo.value = item
  //     showVideo.value = true
  //   }
  // }

</script>
