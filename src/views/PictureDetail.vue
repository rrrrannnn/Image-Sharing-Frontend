<template>
  <div class="picture-detail">
    <NavBar />
    <div class="container" v-loading="loading">
      <div v-if="picture" class="detail-content">
        <div class="picture-section">
          <img 
            :src="picture.originalUrl || picture.url" 
            :alt="picture.name"
            class="picture-image"
            @error="handleImageError"
          />
        </div>
        <div class="info-section">
          <div class="info-header">
            <h2 class="picture-title">{{ picture.name || '未命名图片' }}</h2>
            <div v-if="isOwner" class="action-buttons">
              <el-button type="primary" @click="showEditDialog = true">
                编辑
              </el-button>
              <el-button type="danger" @click="handleDelete">
                删除
              </el-button>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">上传者：</span>
            <span class="info-value">{{ picture.user?.userName || '未知' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">上传日期：</span>
            <span class="info-value">{{ formatDate(picture.createTime) }}</span>
          </div>
          <div class="info-item" v-if="picture.introduction">
            <span class="info-label">简介：</span>
            <span class="info-value">{{ picture.introduction }}</span>
          </div>
          <div class="info-item" v-if="picture.category">
            <span class="info-label">分类：</span>
            <span class="info-value">{{ picture.category }}</span>
          </div>
          <div class="info-item" v-if="picture.pictureSize">
            <span class="info-label">文件大小：</span>
            <span class="info-value">{{ formatFileSize(picture.pictureSize) }}</span>
          </div>
          <div class="info-item" v-if="picture.pictureWidth && picture.pictureHeight">
            <span class="info-label">尺寸：</span>
            <span class="info-value">{{ picture.pictureWidth }} × {{ picture.pictureHeight }}</span>
          </div>
          <div class="info-item" v-if="picture.pictureFormat">
            <span class="info-label">格式：</span>
            <span class="info-value">{{ picture.pictureFormat }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="showEditDialog"
      title="编辑图片信息"
      width="500px"
      @close="resetEditForm"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="图片名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入图片名称" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input
            v-model="editForm.introduction"
            type="textarea"
            :rows="4"
            placeholder="请输入简介"
          />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-input v-model="editForm.category" placeholder="请输入分类" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" @click="handleEdit" :loading="editLoading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import NavBar from '../components/NavBar.vue'
import { getPictureById, editPicture, deletePicture } from '../api/picture'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const picture = ref(null)
const loading = ref(false)
const showEditDialog = ref(false)
const editLoading = ref(false)
const editFormRef = ref(null)

const editForm = ref({
  name: '',
  introduction: '',
  category: ''
})

const editRules = {
  name: [
    { required: true, message: '请输入图片名称', trigger: 'blur' }
  ]
}

const isOwner = computed(() => {
  return userStore.isLoggedIn && picture.value && picture.value.userId === userStore.user?.id
})

const loadPicture = async () => {
  const id = route.params.id
  if (!id) {
    ElMessage.error('图片ID不存在')
    router.push('/')
    return
  }

  loading.value = true
  try {
    const data = await getPictureById(id)
    picture.value = data
    // 初始化编辑表单
    editForm.value = {
      name: data.name || '',
      introduction: data.introduction || '',
      category: data.category || ''
    }
  } catch (error) {
    ElMessage.error(error.message || '加载图片详情失败')
    router.push('/')
  } finally {
    loading.value = false
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'
}

const formatDate = (date) => {
  if (!date) return '未知'
  const d = new Date(date)
  return d.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '未知'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

const resetEditForm = () => {
  if (picture.value) {
    editForm.value = {
      name: picture.value.name || '',
      introduction: picture.value.introduction || '',
      category: picture.value.category || ''
    }
  }
  editFormRef.value?.clearValidate()
}

const handleEdit = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      editLoading.value = true
      try {
        await editPicture(
          picture.value.id,
          editForm.value.name,
          editForm.value.introduction,
          editForm.value.category
        )
        ElMessage.success('编辑成功')
        showEditDialog.value = false
        // 重新加载图片信息
        await loadPicture()
      } catch (error) {
        ElMessage.error(error.message || '编辑失败')
      } finally {
        editLoading.value = false
      }
    }
  })
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这张图片吗？此操作不可恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    try {
      await deletePicture(picture.value.id)
      ElMessage.success('删除成功')
      router.push('/')
    } catch (error) {
      ElMessage.error(error.message || '删除失败')
    } finally {
      loading.value = false
    }
  } catch {
    // 用户取消删除
  }
}

onMounted(async () => {
  await userStore.checkLogin()
  loadPicture()
})
</script>

<style scoped>
.picture-detail {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px;
}

.detail-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.picture-section {
  width: 100%;
}

.picture-image {
  width: 100%;
  height: auto;
  border-radius: 8px;
  object-fit: contain;
  max-height: 600px;
  background-color: #f0f0f0;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.picture-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0;
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.info-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 600;
  color: #666;
  min-width: 100px;
}

.info-value {
  color: #333;
  flex: 1;
}

@media (max-width: 768px) {
  .detail-content {
    grid-template-columns: 1fr;
  }

  .info-header {
    flex-direction: column;
    gap: 16px;
  }

  .action-buttons {
    width: 100%;
  }

  .action-buttons .el-button {
    flex: 1;
  }
}
</style>

