<template>
  <div class="home">
    <NavBar />
    <div class="container">
      <UploadSection @upload-success="handleUploadSuccess" />
      <!-- <div class="pictures-grid" v-loading="loading">
        <PictureCard v-for="picture in pictures" :key="picture.id" :picture="picture" />
      </div> -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :total="total"
          :page-sizes="[6, 12, 24, 48]" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" style="justify-content: flex-end; margin-top: 24px; padding: 20px 0;" />
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
    // 如果重置页面，先设置为第一页
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
    total.value = result.total || 0
  } catch (error) {
    ElMessage.error(error.message || '加载图片列表失败')
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
  // 上传成功后，重置到第一页并重新加载
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
  background-color: #f5f5f5;
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
