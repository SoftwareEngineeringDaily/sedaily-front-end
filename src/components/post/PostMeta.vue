<template>
  <div class="post-details" :class="{ bold: isPreview }">
    <div class="date">{{ publicationDate }}</div>
    <span v-if="showDuration">|</span>
    <div v-if="showDuration" class="duration">40 mins</div>
    <span>|</span>
    <div v-if="post.thread" class="comment-count">{{ commentCount }} comments</div>
    <div v-else class="comment-count">0 comments</div>
    <span>|</span>
    <div class="like" @click="like">
      <i class="fa" :class="{ 'fa-heart-o': !likeActive, 'fa-heart': likeActive }"></i>
      {{ post.likeCount }}
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
    isPreview: {
      type: Boolean,
      default: false
    },
    showDuration: {
      type: Boolean,
      default: true
    },
    commentCount: {
      type: Number,
      default: 0,
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
    }
  },

  methods: {
    ...mapActions([
      'likePost',
    ]),

    like () {
      this.likePost({
        id: this.post._id,
        active: !this.likeActive,
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

.like {
  cursor: pointer;
}
</style>
