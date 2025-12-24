import api from './index'

// User login
export function login(userAccount, userPassword) {
  return api.post('/user/login', {
    userAccount,
    userPassword
  })
}

// User register
export function register(userAccount, userPassword, checkPassword) {
  return api.post('/user/register', {
    userAccount,
    userPassword,
    checkPassword
  })
}

// Get current logged in user
export function getLoginUser() {
  return api.get('/user/get/login')
}

// User logout
export function logout() {
  return api.post('/user/logout')
}

