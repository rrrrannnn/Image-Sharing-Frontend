<template>
  <div class="picture-card" @click="handleClick">
    <div class="picture-image-wrapper">
      <img 
        :src="picture.thumbUrl || picture.imageUrl" 
        :alt="picture.title"
        class="picture-image"
        @error="handleImageError"
      />
    </div>
    <div class="picture-info">
      <p class="picture-name">{{ picture.title || 'Untitled Image' }}</p>
      <p class="picture-uploader">Uploader: {{ picture.uploader?.nickname || 'Unknown' }}</p>
      <p class="picture-date">Upload Date: {{ formatDate(picture.uploadTime) }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  picture: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const handleClick = () => {
  router.push(`/picture/${props.picture.picId}`)
}

const imageError = ref(false)

const handleImageError = (e) => {
  if (!imageError.value) {
    imageError.value = true
    e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'
  }
}

const formatDate = (date) => {
  if (!date) return 'Unknown'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}
</script>

<style scoped>
.picture-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.picture-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.picture-image-wrapper {
  width: 100%;
  padding-top: 75%; /* 4:3 比例 */
  position: relative;
  overflow: hidden;
  background-color: #f0f0f0;
}

.picture-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.picture-info {
  padding: 16px;
}

.picture-name {
  font-size: 16px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.picture-uploader,
.picture-date {
  font-size: 14px;
  color: #666;
  margin: 4px 0;
}
</style>

