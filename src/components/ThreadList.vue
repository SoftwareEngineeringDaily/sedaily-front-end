<template>
  <div class="forum-thread-list">
    <thread-item v-for="thread in threads" :key="thread._id" :thread="thread"></thread-item>
  </div>
</template>

<script>
import ThreadItem from '@/components/ThreadItem.vue'

export default {
  name: 'thread-list',
  components: { ThreadItem },
  props: {
    threads: {
      type: Array,
      required: true
    }
  }
}
</script>
