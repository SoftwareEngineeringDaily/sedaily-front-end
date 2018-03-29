
<template>
  <div class="row">
    <div class="col-sm-8 md">
      <div class='forum-thread-title'>
        {{title}}
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
export default {
  name: 'form-thread-body',
  props: {
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  computed: {
    compiledMarkdown () {
      marked.setOptions({
        breaks: true
      })
      return marked(this.content)
    }
  }
}
</script>

<style lang="stylus" scoped>
  .forum-thread-title
    font-size 2.6rem
    font-weight 200

  .forum-thread-content
    font-size 1.1rem
    font-weight 200
</style>
