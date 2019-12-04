<template>
  <forum-new-thread-wrapper
  :initialContent="initialContent"
  >
  </forum-new-thread-wrapper>

</template>

<script>
import ForumNewThreadWrapper from '@/components/forum/ForumNewThreadWrapper'
export default {
  name: 'new-forum-thread-view',
  props: ['initialContent'],
  components: {
    ForumNewThreadWrapper
  }
}
</script>
