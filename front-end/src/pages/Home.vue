<template>

  <v-container class="">
    <div class="items-center w-100  d-flex justify-center">

      <v-card class="pa-10 rounded-lg w-100 overflow-auto " style="max-width: 1200px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);">

        <div class="px-2 mb-5">
          <span class="text-h6" style="font-weight: bold;">Seus Videos</span>
        </div>
        <v-expand-transition>
          <div v-if="folderHistory.length > 0" class="px-2">
            <v-btn
              class="text-capitalize"
              color="grey-darken-4"
              elevation="2"
              prepend-icon="mdi-arrow-left"
              variant="elevated"
              @click="backButton"
            >
              Voltar
            </v-btn>
          </div>
        </v-expand-transition>
        <v-row class="px-2 mb-4 justify-space-between" :class="[currentFolder != null ? 'mt-4' : 'mt-0']" no-gutters>
          <v-col class="d-flex align-center " cols="12" md="4">
            <v-text-field
              v-model="search"
              class="w-100"
              :clearable="true"
              density="compact"
              hide-details
              placeholder="Filtre por nome de pasta ou vídeo…"
              prepend-inner-icon="mdi-magnify"
              style="height: 40px; margin: 0;"
              variant="solo"
              @click:clear="search = ''"
            />
          </v-col>

          <v-col class="d-flex align-center justify-end" cols="12" md="6">
            <v-select
              v-model="itemsPerPage"
              class="ma-0"
              density="compact"
              hide-details
              :items="[5, 10, 20, 50]"
              label="Itens por página"
              style="max-width: 150px; height: 40px;"
              variant="solo"
            />
          </v-col>
        </v-row>
        <v-row class="px-6 w-100 d-flex flex-column" dense>

          <v-card
            v-for="item in paginatedItems"
            :key="item.id"
            class="mb-3 pa-4 rounded d-flex align-center cursor-pointer "
            color="grey-lighten-4"
            :hover="true"
            @click="handleRowClick({ item })"
          >
            <template v-if="item.isFolder">
              <v-icon class="mr-4" color="primary" size="48">mdi-folder</v-icon>
              <div>
                <div class="text-subtitle-1 font-weight-medium">{{ item.name }}</div>
                <div class="text-caption text-grey-darken-1">{{ item.count }} vídeos</div>
              </div>
            </template>

            <template v-else>
              <v-img
                aspect-ratio="16/9"
                class="rounded mr-4"
                cover
                height="80"
                :src="item.thumbnail"
                width="140"
              >
                <template #placeholder>
                  <v-skeleton-loader height="100" type="image" width="180" />
                </template>
              </v-img>

              <div class="d-flex flex-column justify-space-between w-100">
                <div class="d-flex justify-space-between align-center">
                  <div class="text-subtitle-1 font-weight-medium text-truncate">
                    {{ item.title || 'Sem título' }}
                  </div>
                  <v-chip
                    class="ml-2 d-flex align-center"
                    :color="item.status === 'CONVERTING' ? 'blue' : 'green'"
                    label
                    size="small"
                  >
                    <template v-if="item.status === 'CONVERTING'">
                      <v-progress-circular
                        class="mr-2"
                        color="white"
                        indeterminate
                        size="14"
                        width="2"
                      />
                      Convertendo...
                    </template>
                    <template v-else>
                      {{ item.status }}
                    </template>
                  </v-chip>
                </div>

                <div class="d-flex justify-space-between text-caption mt-2">
                  <div><v-icon class="mr-1" size="16">mdi-calendar</v-icon>{{ formatDate(item.created_at) }}</div>
                  <div><v-icon class="mr-1" size="16">mdi-clock</v-icon>{{ formatLength(item.length) }}</div>
                  <div><v-icon class="mr-1" size="16">mdi-database</v-icon>{{ formatSize(item.storage_size) }}</div>
                </div>
              </div>
            </template>
          </v-card>

        </v-row>
        <v-pagination
          v-model="page"
          class="mt-4 align-self-center"
          :length="Math.ceil(filteredItems.length / itemsPerPage)"
        />

      </v-card>
    </div>

  </v-container>

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

</template>

<script setup>
  import { useRouter } from 'vue-router'
  import { getFolders } from '@/api/folders.api'
  import { getVideos } from '@/api/videos.api'
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
  const folders = ref([])
  const folderHistory = ref([])

  const cacheFolder = new Map()
  const cacheData = new Map()

  const page = ref(1)
  const itemsPerPage = ref(5)

  const NAV_KEY = 'last_folder'
  const HISTORY_KEY = 'folder_history'

  function saveNavigation () {
    localStorage.setItem(NAV_KEY, currentFolder.value ?? '')
    localStorage.setItem(HISTORY_KEY, JSON.stringify(folderHistory.value ?? []))
  }

  function loadNavigation () {
    const savedId = localStorage.getItem(NAV_KEY)
    const savedHistory = localStorage.getItem(HISTORY_KEY)

    return {
      folderId: savedId || null,
      history: savedHistory ? JSON.parse(savedHistory) : [],
    }
  }

  const columns = [
    { title: 'Nome', key: 'name', sortable: true, width: '50%' },
    { title: 'Tamanho', key: 'storage_size', sortable: true, align: 'right', width: '15%' },
    { title: 'Duração', key: 'length', sortable: true, align: 'right', width: '15%' },
    { title: 'Modificação', key: 'created_at', sortable: true, width: '30%' },
  ]

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
      v.folder_id === currentFolder.value,
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
      clickable: index !== folderHistory.value.length - 1,
      onClick: () => {
        const subPath = folderHistory.value.slice(0, index + 1)
        folderHistory.value = subPath
        fetchFolders(folder.id)
        fetchVideos(folder.id)
      },
    })),
  ])

  onMounted (async () => {
    const token = localStorage.getItem('token')
    console.log(token)

    const publicPages = ['/login', '/unauthorized']
    if (!token && !publicPages.includes(router.currentRoute.value.path)) {
      router.replace('/login')
    }
    isLoading.value = true
    const { folderId, history } = loadNavigation()
    currentFolder.value = folderId
    folderHistory.value = history || []
    await fetchFolders(currentFolder.value)
    await fetchVideos(currentFolder.value)
    isLoading.value = false
  })

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredItems.value.slice(start, end)
  })

  async function fetchVideos (folderId = null) {
    isLoading.value = true

    if (cacheData.has(folderId)) {
      videos.value = cacheData.get(folderId)
    } else {
      try {
        const { data } = await getVideos(folderId ? { folder_id: folderId } : {})
        const fetchedVideos = data.videos || []
        videos.value = fetchedVideos
        console.log(videos.value)
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
      const cached = cacheFolder.get(parentFolderId)
      folders.value = parentFolderId === null
        ? cached.filter(folder => folder.parent_folder_id === null)
        : cached
    } else {
      try {
        const { data } = await getFolders(parentFolderId ? { parent_folder_id: parentFolderId } : {})
        const fetchedFolders = data.folders || []
        folders.value = parentFolderId === null
          ? fetchedFolders.filter(folder => folder.parent_folder_id === null)
          : fetchedFolders
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
    saveNavigation()
    isLoading.value = false
  }

  async function handleRowClick ({ item }) {
    if (item.isFolder) {
      await fetchFolders(item.id)
      await fetchVideos(item.id)
    } else {
      console.log(item)
      router.push(`/video/${item.id}`)
    }
  }

  function backButton () {
    if (folderHistory.value.length === 0) {
      currentFolder.value = null
      fetchFolders(null)
      fetchVideos(null)
      saveNavigation()
      return
    }

    folderHistory.value.pop()

    const previous = folderHistory.value.at(-1)

    currentFolder.value = previous?.id || null
    fetchFolders(currentFolder.value)
    fetchVideos(currentFolder.value)
    saveNavigation()
  }

</script>
