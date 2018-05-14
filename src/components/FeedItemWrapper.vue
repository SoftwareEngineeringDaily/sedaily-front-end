<template>
  <div>
    <forum-thread-summary
    v-if="isThread"
    :key="feedItem._id"
    :forumThread="feedItem"/>
    <div v-else>
      Feed Item
    </div>

  </div>
</template>

<script>
  import FeedItem from '@/components/FeedItem.vue'
  import ForumThreadSummary from '@/components/ForumThreadSummary'
  export default {
    name: 'feed-item-wrapper',
    props: {
      feedItem: {
        type: Object,
        required: true
      }
    },
    components: {
      ForumThreadSummary
    },
    computed: {
      isThread () {
        return this.feedItem.relatedLink == null;
      }
    }
  }
</script>
