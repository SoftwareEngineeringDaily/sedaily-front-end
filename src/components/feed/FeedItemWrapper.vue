<template>
  <div>
    <forum-thread-summary
      v-if="isThread"
      :key="feedItem._id"
      :forumThread="feedItem"/>
    <div v-else>
      <feed-item
        :feedItem="feedItem.relatedLink" />
    </div>
  </div>
</template>

<script>
  import FeedItem from '@/components/feed/FeedItem'
  import ForumThreadSummary from '@/components/forum/ForumThreadSummary'
  export default {
    name: 'feed-item-wrapper',
    props: {
      feedItem: {
        type: Object,
        required: true
      }
    },
    components: {
      ForumThreadSummary,
      FeedItem
    },
    computed: {
      isThread () {
        return this.feedItem.relatedLink == null;
      }
    }
  }
</script>
