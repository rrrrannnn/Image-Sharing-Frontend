<template>
  <div class="upload-section">
    <div class="upload-content">
      <p class="upload-text">Click to upload high-quality image</p>
      <el-upload
        ref="uploadRef"
        :auto-upload="false"
        :on-change="handleFileChange"
        :show-file-list="false"
        accept="image/*"
      >
        <template #trigger>
          <el-button type="primary" :loading="uploading">
            Upload Image
          </el-button>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadPicture } from '../api/picture'
import { useUserStore } from '../stores/user'

const emit = defineEmits(['upload-success'])

const uploadRef = ref(null)
const uploading = ref(false)
const userStore = useUserStore()

const handleFileChange = async (file) => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('Please login first')
    return
  }

  uploading.value = true
  try {
    await uploadPicture(file.raw, file.name)
    ElMessage.success('Upload successful')
    emit('upload-success')
    // Clear file selection
    uploadRef.value?.clearFiles()
  } catch (error) {
    ElMessage.error(error.message || 'Upload failed')
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.upload-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.upload-text {
  font-size: 18px;
  color: #666;
  margin: 0;
}
</style>

