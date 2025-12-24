import api from './index'

// 分页获取图片列表
export function getPictureList(params) {
  return api.post('/picture/list/page/vo', params)
}

// 获取图片详情
export function getPictureById(id) {
  return api.get('/picture/get/vo', {
    params: { id }
  })
}

// 上传图片
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

// 编辑图片
export function editPicture(id, name, introduction, category) {
  return api.post('/picture/edit', {
    id,
    name,
    introduction,
    category
  })
}

// 删除图片
export function deletePicture(id) {
  return api.post('/picture/delete', {
    id
  })
}

