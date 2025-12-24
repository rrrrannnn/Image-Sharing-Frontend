<template>
  <div class="pagination-wrapper">
    <el-pagination
      :current-page="currentPage"
      :page-size="currentPageSize"
      :total="total"
      :page-sizes="[6, 12, 24, 48]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  modelValue: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 6
  }
})

const emit = defineEmits(['update:modelValue', 'update:pageSize', 'change'])

const currentPage = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const currentPageSize = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val)
})

const handleSizeChange = (size) => {
  emit('update:pageSize', size)
  emit('update:modelValue', 1)
  emit('change', { page: 1, pageSize: size })
}

const handleCurrentChange = (page) => {
  emit('update:modelValue', page)
  emit('change', { page, pageSize: props.pageSize })
}
</script>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding: 20px 0;
}
</style>

