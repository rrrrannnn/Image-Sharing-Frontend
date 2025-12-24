<template>
  <div class="picture-detail">
    <NavBar />
    <div class="container" v-loading="loading">
      <div v-if="picture" class="detail-content">
        <div class="picture-section">
          <img 
            :src="picture.imageUrl" 
            :alt="picture.title"
            class="picture-image"
            @error="handleImageError"
          />
        </div>
        <div class="info-section">
          <div class="info-header">
            <h2 class="picture-title">{{ picture.title || 'Untitled Image' }}</h2>
            <div v-if="isOwner" class="action-buttons">
              <el-button type="primary" @click="showEditDialog = true">
                Edit
              </el-button>
              <el-button type="danger" @click="handleDelete">
                Delete
              </el-button>
            </div>
          </div>
          <div class="info-item">
            <span class="info-label">Uploader:</span>
            <span class="info-value">{{ picture.uploader?.nickname || 'Unknown' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Upload Date:</span>
            <span class="info-value">{{ formatDate(picture.uploadTime) }}</span>
          </div>
          <div class="info-item" v-if="picture.desc">
            <span class="info-label">Description:</span>
            <span class="info-value">{{ picture.desc }}</span>
          </div>
          <div class="info-item" v-if="picture.tag">
            <span class="info-label">Category:</span>
            <span class="info-value">{{ picture.tag }}</span>
          </div>
          <div class="info-item" v-if="picture.size">
            <span class="info-label">File Size:</span>
            <span class="info-value">{{ formatFileSize(picture.size) }}</span>
          </div>
          <div class="info-item" v-if="picture.width && picture.height">
            <span class="info-label">Dimensions:</span>
            <span class="info-value">{{ picture.width }} × {{ picture.height }}</span>
          </div>
          <div class="info-item" v-if="picture.format">
            <span class="info-label">Format:</span>
            <span class="info-value">{{ picture.format }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <el-dialog
      v-model="showEditDialog"
      title="Edit Image Information"
      width="500px"
      @close="resetEditForm"
    >
      <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="80px">
        <el-form-item label="Image Name" prop="name">
          <el-input v-model="editForm.name" placeholder="Please enter image name" />
        </el-form-item>
        <el-form-item label="Description" prop="introduction">
          <el-input
            v-model="editForm.introduction"
            type="textarea"
            :rows="4"
            placeholder="Please enter description"
          />
        </el-form-item>
        <el-form-item label="Category" prop="category">
          <el-input v-model="editForm.category" placeholder="Please enter category" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEditDialog = false">Cancel</el-button>
        <el-button type="primary" @click="handleEdit" :loading="editLoading">
          Save
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
    { required: true, message: 'Please enter image name', trigger: 'blur' }
  ]
}

const isOwner = computed(() => {
  return userStore.isLoggedIn && picture.value && picture.value.uploaderId === userStore.user?.uid
})

const loadPicture = async () => {
  const id = route.params.id
  if (!id) {
    ElMessage.error('Image ID does not exist')
    router.push('/')
    return
  }

  loading.value = true
  try {
    const data = await getPictureById(id)
    picture.value = data
    // Initialize edit form
    editForm.value = {
      name: data.title || '',
      introduction: data.desc || '',
      category: data.tag || ''
    }
  } catch (error) {
    ElMessage.error(error.message || 'Failed to load image details')
    router.push('/')
  } finally {
    loading.value = false
  }
}

const handleImageError = (e) => {
  e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = new Date(date)
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return 'Unknown'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB'
}

const resetEditForm = () => {
  if (picture.value) {
    editForm.value = {
      name: picture.value.title || '',
      introduction: picture.value.desc || '',
      category: picture.value.tag || ''
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
          picture.value.picId,
          editForm.value.name,
          editForm.value.introduction,
          editForm.value.category
        )
        ElMessage.success('Edit successful')
        showEditDialog.value = false
        // Reload image information
        await loadPicture()
      } catch (error) {
        ElMessage.error(error.message || 'Edit failed')
      } finally {
        editLoading.value = false
      }
    }
  })
}

const handleDelete = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to delete this image? This action cannot be undone.',
      'Confirm Delete',
      {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }
    )

    loading.value = true
    try {
      await deletePicture(picture.value.picId)
      ElMessage.success('Delete successful')
      router.push('/')
    } catch (error) {
      ElMessage.error(error.message || 'Delete failed')
    } finally {
      loading.value = false
    }
  } catch {
    // User cancelled deletion
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

