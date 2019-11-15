<template>
  <forum-new-thread-wrapper
  :initialContent="``"
  >
  </forum-new-thread-wrapper>

</template>

<script>
import ForumNewThreadWrapper from '@/components/forum/ForumNewThreadWrapper'
export default {
  name: 'new-forum-thread-view',
  components: {
    ForumNewThreadWrapper
  }
}
</script>
