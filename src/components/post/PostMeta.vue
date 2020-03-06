<template>
  <div class="post-details" :class="{ bold: isPreview }">
    <div class="date">{{ publicationDate }}</div>
    <span v-if="showDuration">|</span>
    <div v-if="showDuration" class="duration">40 mins</div>
    <span>|</span>
    <div v-if="post.thread" class="comment-count">
      {{ post.thread.commentsCount || 0 }} comment{{ post.thread.commentsCount !== 1 ? 's' : '' }}
    </div>
    <div v-else class="comment-count">0 comments</div>
    <span>|</span>
    <div class="cursor-pointer" @click="like">
      <i class="fa fa-lg" :class="{ 'fa-heart-o': !likeActive, 'fa-heart': likeActive }"></i>
      {{ post.likeCount }}
    </div>
    <div class="cursor-pointer" @click="bookmark">
      <i class="fa fa-lg" :class="{ 'fa-bookmark-o': !bookmarkActive, 'fa-bookmark': bookmarkActive }"></i>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapActions } from 'vuex'

export default {
  name: "post-meta",
  props: {
    post: {
      type: Object,
      required: true
    },
    displayedPosts: {
      type: Array,
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    showDuration: {
      type: Boolean,
      default: true
    },
  },

  computed: {
    publicationDate () {
      let format = this.isPreview ? 'MMM Do' : 'MMMM Do, YYYY'
      if (this.post) {
        return moment(this.post.date).format(format)
      }
    },

    likeActive () {
      return !!(this.post.likeActive)
    },

    bookmarkActive () {
      return !!(this.post.bookmarkActive)
    },
  },

  methods: {
    ...mapActions([
      'likePost',
      'bookmarkPost',
    ]),

    like () {
      this.likePost({
        id: this.post._id,
        active: !this.likeActive,
        posts: this.displayedPosts,
      })
    },

    bookmark () {
      this.bookmarkPost({
        id: this.post._id,
        active: !this.bookmarkActive,
        posts: this.displayedPosts,
      })
    }
  },
}
</script>

<style>
.post-details {
  display: flex;
  font-size: 0.8rem;
  letter-spacing: 0.6px;
  font-weight: 600;
  text-transform: uppercase;
}

.post-details > * {
  margin-right: 10px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
