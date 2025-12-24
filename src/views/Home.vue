<template>
  <div class="home">
    <NavBar />
    <div class="container">
      <UploadSection @upload-success="handleUploadSuccess" />
      <div class="pictures-grid" v-loading="loading">
        <PictureCard v-for="picture in pictures" :key="picture.picId" :picture="picture" />
      </div>
      <div class="pagination-container" v-if="total > 0">
        <el-pagination :current-page="Number(currentPage)" :page-size="Number(pageSize)" :total="Number(total)"
          :page-sizes="[6, 12, 24, 48]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import NavBar from '../components/NavBar.vue'
import UploadSection from '../components/UploadSection.vue'
import PictureCard from '../components/PictureCard.vue'
import { getPictureList } from '../api/picture'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()
const pictures = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)
const total = ref(0)

const loadPictures = async (resetPage = false) => {
  loading.value = true
  try {
    // If reset page, set to first page
    if (resetPage) {
      currentPage.value = 1
    }

    const result = await getPictureList({
      current: currentPage.value,
      pageSize: pageSize.value,
      sortField: 'createTime',
      sortOrder: 'descend'
    })

    pictures.value = result.records || []
    // Ensure total is a number
    const totalValue = result.total
    if (totalValue !== undefined && totalValue !== null) {
      total.value = Number(totalValue)
    } else {
      total.value = 0
    }
  } catch (error) {
    ElMessage.error(error.message || 'Failed to load image list')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  loadPictures()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  loadPictures()
}

const handleUploadSuccess = () => {
  // After successful upload, reset to first page and reload
  loadPictures(true)
}

onMounted(async () => {
  await userStore.checkLogin()
  loadPictures()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: #e6f3ff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.pictures-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .pictures-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .pictures-grid {
    grid-template-columns: 1fr;
  }
}
</style>
