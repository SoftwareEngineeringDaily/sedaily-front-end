<template>
  <div class="row">
    <div class="col-sm-9">
      <div class='forum-thread-title'>
        <span v-if="!podcastEpisode">
        {{title}}
      </span>
      <router-link v-else :to="podcastEpisodeUrl"> {{title}} </router-link>
      </div>
      <hr />
      <div class='forum-thread-content'>
        <div v-html="compiledMarkdown" />
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import { postPrettyUrl } from './../utils/Post.utils'
export default {
  name: 'form-thread-body',
  props: {
    title: {
      type: String,
      required: true
    },
    podcastEpisode: {
      type: Object
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    podcastEpisodeUrl () {
      return postPrettyUrl(this.podcastEpisode)
    },

    compiledMarkdown () {
      marked.setOptions({
        breaks: true
      })
      return marked(this.content)
    }
  }
}
/* The /deep/ below is needed because of v-html not having CSS applied to it:*/
</script>

<style lang="stylus" scoped>
@import '../css/variables'

div.forum-thread-content {
  /deep/ a {
    color: primary-color;
  }
}

.forum-thread-title
  font-size 2.6rem
  font-weight 200

.forum-thread-content
  font-size 1.1rem
  word-break break-word
  font-weight 200

</style>
