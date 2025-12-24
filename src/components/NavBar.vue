<template>
  <div class="navbar">
    <div class="navbar-content">
      <div class="navbar-left">
        <h1 class="navbar-title">Image Sharing Platform</h1>
      </div>
      <div class="navbar-right">
        <el-button 
          @click="$router.push('/')" 
          :class="currentPath === '/' ? 'active-btn' : 'nav-btn'"
        >
          Home
        </el-button>
        <el-button 
          @click="$router.push('/my-images')" 
          :class="currentPath === '/my-images' ? 'active-btn' : 'nav-btn'"
        >
          My Image
        </el-button>
        <el-button 
          v-if="!isLoggedIn"
          @click="$router.push('/login')" 
          :class="currentPath === '/login' ? 'active-btn' : 'nav-btn'"
        >
          Login/Register
        </el-button>
        <el-button 
          v-else
          @click="handleLogout" 
          class="nav-btn"
        >
          Logout
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user'
import { logout } from '../api/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const currentPath = computed(() => route.path)
const isLoggedIn = computed(() => userStore.isLoggedIn)

const handleLogout = async () => {
  try {
    await logout()
    userStore.clearUser()
    ElMessage.success('Logout successful')
    router.push('/')
  } catch (error) {
    ElMessage.error(error.message || 'Logout failed')
  }
}

onMounted(() => {
  userStore.checkLogin()
})
</script>

<style scoped>
.navbar {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 0 20px;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.navbar-left {
  flex: 1;
}

.navbar-title {
  font-size: 24px;
  font-weight: 600;
  color: #409eff;
  margin: 0;
}

.navbar-right {
  display: flex;
  gap: 12px;
}

.nav-btn {
  border-color: #409eff;
  color: #409eff;
  background-color: #fff;
}

.nav-btn:hover {
  border-color: #66b1ff;
  color: #66b1ff;
  background-color: #ecf5ff;
}

.active-btn {
  border-color: #409eff;
  color: #409eff;
  background-color: #fff;
  font-weight: 600;
}
</style>

