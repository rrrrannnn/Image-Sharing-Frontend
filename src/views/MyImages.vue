<template>
  <div class="my-images">
    <NavBar />
    <div class="container">
      <h2 class="page-title">My Images</h2>
      <div class="pictures-grid" v-loading="loading">
        <PictureCard 
          v-for="picture in pictures" 
          :key="picture.id" 
          :picture="picture"
        />
        <div v-if="!loading && pictures.length === 0" class="empty-state">
          <p>暂无图片</p>
        </div>
      </div>
      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[6, 12, 24, 48]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          style="justify-content: flex-end; margin-top: 24px; padding: 20px 0;"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import PictureCard from '../components/PictureCard.vue'
import { getPictureList } from '../api/picture'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const pictures = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(6)
const total = ref(0)

const loadPictures = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  loading.value = true
  try {
    const result = await getPictureList({
      current: currentPage.value,
      pageSize: pageSize.value,
      userId: userStore.user?.id,
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

onMounted(async () => {
  await userStore.checkLogin()
  loadPictures()
})
</script>

<style scoped>
.my-images {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
}

.pictures-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 24px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
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

