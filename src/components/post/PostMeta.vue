<template>
  <div class="post-details" :class="{ bold: isPreview }">
    <div class="date">{{ publicationDate }}</div>
    <span v-if="showDuration">|</span>
    <div v-if="showDuration" class="duration">40 mins</div>
    <span>|</span>

    <div v-if="post.thread && showComments" class="comment-count">
      {{ post.thread.commentsCount || 0 }} comment{{ post.thread.commentsCount !== 1 ? 's' : '' }}
      <span>|</span>
    </div>

    <div class="cursor-pointer" @click="like">
      <i class="fa fa-lg" :class="{ 'fa-heart-o': !likeActive, 'fa-heart': likeActive }"></i>
      <span v-if="showLikes">{{ post.score }}</span>
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
     showEmptyLikes: {
      type: Boolean,
      default: true,
    },
    showEmptyComments: {
      type: Boolean,
      default: true,
    }
  },

  computed: {
    publicationDate () {
      let format = this.isPreview ? 'MMM Do' : 'MMMM Do, YYYY'
      if (this.post) {
        return moment(this.post.date).format(format)
      }
    },

    showLikes () {
      if (this.showEmptyLikes) return true
      return this.post.score
    },

    showComments () {
      if (this.showEmptyComments) return true
      return this.post.thread.commentsCount || false
    },

    likeActive () {
      return !!(this.post.upvoted)
    },

    bookmarkActive () {
      return !!(this.post.bookmarked)
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
        active: !this.bookmarked,
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
