<template>
  <div class="login">
    <NavBar />
    <div class="container">
      <div class="login-card">
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="登录" name="login">
            <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" label-width="80px">
              <el-form-item label="账号" prop="userAccount">
                <el-input v-model="loginForm.userAccount" placeholder="请输入账号" />
              </el-form-item>
              <el-form-item label="密码" prop="userPassword">
                <el-input 
                  v-model="loginForm.userPassword" 
                  type="password" 
                  placeholder="请输入密码"
                  @keyup.enter="handleLogin"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleLogin" :loading="loginLoading" style="width: 100%">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" label-width="80px">
              <el-form-item label="账号" prop="userAccount">
                <el-input v-model="registerForm.userAccount" placeholder="请输入账号" />
              </el-form-item>
              <el-form-item label="昵称" prop="userName">
                <el-input v-model="registerForm.userName" placeholder="请输入昵称" />
              </el-form-item>
              <el-form-item label="密码" prop="userPassword">
                <el-input 
                  v-model="registerForm.userPassword" 
                  type="password" 
                  placeholder="请输入密码"
                />
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPassword">
                <el-input 
                  v-model="registerForm.checkPassword" 
                  type="password" 
                  placeholder="请再次输入密码"
                  @keyup.enter="handleRegister"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleRegister" :loading="registerLoading" style="width: 100%">
                  注册
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
  userName: '',
  userPassword: '',
  checkPassword: ''
})

const validateCheckPassword = (rule, value, callback) => {
  if (value !== registerForm.value.userPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const loginRules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

const registerRules = {
  userAccount: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 4, message: '账号长度至少4个字符', trigger: 'blur' }
  ],
  userName: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
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
        ElMessage.success('登录成功')
        router.push('/')
      } catch (error) {
        ElMessage.error(error.message || '登录失败')
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
          registerForm.value.userName,
          registerForm.value.userPassword,
          registerForm.value.checkPassword
        )
        ElMessage.success('注册成功，请登录')
        activeTab.value = 'login'
        loginForm.value.userAccount = registerForm.value.userAccount
      } catch (error) {
        ElMessage.error(error.message || '注册失败')
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

