<template>
  <div class="login">
    <NavBar />
    <div class="container">
      <div class="login-card">
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="Login" name="login">
            <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
              <el-form-item label="Account" prop="userAccount">
                <el-input v-model="loginForm.userAccount" placeholder="Please enter account" />
              </el-form-item>
              <el-form-item label="Password" prop="userPassword">
                <el-input 
                  v-model="loginForm.userPassword" 
                  type="password" 
                  placeholder="Please enter password"
                  @keyup.enter="handleLogin"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleLogin" :loading="loginLoading" style="width: 100%">
                  Login
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="Register" name="register">
            <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px">
              <el-form-item label="Account" prop="userAccount">
                <el-input v-model="registerForm.userAccount" placeholder="Please enter account" />
              </el-form-item>
              <el-form-item label="Password" prop="userPassword">
                <el-input 
                  v-model="registerForm.userPassword" 
                  type="password" 
                  placeholder="Please enter password"
                />
              </el-form-item>
              <el-form-item label="Confirm Password" prop="checkPassword">
                <el-input 
                  v-model="registerForm.checkPassword" 
                  type="password" 
                  placeholder="Please enter password again"
                  @keyup.enter="handleRegister"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleRegister" :loading="registerLoading" style="width: 100%">
                  Register
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import NavBar from '../components/NavBar.vue'
import { login, register } from '../api/user'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('login')
const loginFormRef = ref(null)
const registerFormRef = ref(null)
const loginLoading = ref(false)
const registerLoading = ref(false)

const loginForm = ref({
  userAccount: '',
  userPassword: ''
})

const registerForm = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: ''
})

const validateCheckPassword = (rule, value, callback) => {
  if (value !== registerForm.value.userPassword) {
    callback(new Error('Passwords do not match'))
  } else {
    callback()
  }
}

const loginRules = {
  userAccount: [
    { required: true, message: 'Please enter account', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: 'Please enter password', trigger: 'blur' }
  ]
}

const registerRules = {
  userAccount: [
    { required: true, message: 'Please enter account', trigger: 'blur' },
    { min: 4, message: 'Account must be at least 4 characters', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: 'Please enter password', trigger: 'blur' },
    { min: 6, message: 'Password must be at least 6 characters', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: 'Please enter password again', trigger: 'blur' },
    { validator: validateCheckPassword, trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loginLoading.value = true
      try {
        const userData = await login(loginForm.value.userAccount, loginForm.value.userPassword)
        userStore.setUser(userData)
        ElMessage.success('Login successful')
        router.push('/')
      } catch (error) {
        ElMessage.error(error.message || 'Login failed')
      } finally {
        loginLoading.value = false
      }
    }
  })
}

const handleRegister = async () => {
  if (!registerFormRef.value) return
  
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      registerLoading.value = true
      try {
        await register(
          registerForm.value.userAccount,
          registerForm.value.userPassword,
          registerForm.value.checkPassword
        )
        ElMessage.success('Registration successful, please login')
        activeTab.value = 'login'
        loginForm.value.userAccount = registerForm.value.userAccount
      } catch (error) {
        ElMessage.error(error.message || 'Registration failed')
      } finally {
        registerLoading.value = false
      }
    }
  })
}

onMounted(async () => {
  const isLoggedIn = await userStore.checkLogin()
  if (isLoggedIn) {
    router.push('/')
  }
})
</script>

<style scoped>
.login {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 60px 20px;
}

.login-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.login-tabs {
  margin-top: 20px;
}
</style>

