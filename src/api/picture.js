import api from './index'

// Get paginated image list
export function getPictureList(params) {
  return api.post('/picture/list/page/vo', params)
}

// Get image details
export function getPictureById(id) {
  return api.get('/picture/get/vo', {
    params: { id }
  })
}

// Upload image
export function uploadPicture(file, pictureName) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('pictureName', pictureName || '')
  return api.post('/picture/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// Edit image
export function editPicture(id, name, introduction, category) {
  return api.post('/picture/edit', {
    id,
    name,
    introduction,
    category
  })
}

// Delete image
export function deletePicture(id) {
  return api.post('/picture/delete', {
    id
  })
}

