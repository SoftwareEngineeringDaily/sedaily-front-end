<template>
  <forum-new-thread-wrapper
  :initialContent="`## What are you building?
...
## Why did you start building this?
...
## How can this be used? Do you have a demo or code example?
...
## How far along are you?
...
## What's the biggest vision for what this project could become?
...
## Are you looking for other contributors? If so, how could they help?
...
`"
  >
  </forum-new-thread-wrapper>

</template>

<script>
import ForumNewThreadWrapper from '@/components/ForumNewThreadWrapper.vue'
export default {
  name: 'new-forum-thread-view',
  components: {
    ForumNewThreadWrapper
  }
}
</script>
