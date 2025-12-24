import api from './index'

// 用户登录
export function login(userAccount, userPassword) {
  return api.post('/user/login', {
    userAccount,
    userPassword
  })
}

// 用户注册
export function register(userAccount, userName, userPassword, checkPassword) {
  return api.post('/user/register', {
    userAccount,
    userName,
    userPassword,
    checkPassword
  })
}

// 获取当前登录用户
export function getLoginUser() {
  return api.get('/user/get/login')
}

// 用户登出
export function logout() {
  return api.post('/user/logout')
}

