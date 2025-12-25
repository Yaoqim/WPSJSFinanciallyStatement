<template>
  <div>
    <RouterView />
  </div>
</template>

<style scoped></style>

<script>
import { ref, onMounted } from 'vue'

export default {
  setup() {
    const message = ref('AI财报分析')

    onMounted(() => {
      console.log('[AI财报] Web应用已加载')
    })

    return {
      message
    }
  }
}
</script>
