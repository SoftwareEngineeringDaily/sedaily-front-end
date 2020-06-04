<template>
  <ul>
    <li v-for="(post, index) in popularPosts" :key="post._id">
      <a :href="`/post/${post._id}/${post.slug}`">
        <div class="rank">{{index + 1}}</div>
        <news-title v-if="post.title && post.title.rendered">
          {{post.title.rendered}}
        </news-title>
      </a>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { NewsTitle } from '@/components/typography'

export default {
  name: 'popular-posts',

  components: {
    NewsTitle,
  },

  computed: {
    ...mapState([
      'popularPosts',
    ]),
  },

  async mounted () {
    await this.fetchPopular()
    console.log('this.popularPosts ', this.popularPosts)
  },

  methods: {
    ...mapActions([
      'fetchPopular',
    ]),
  }
}
</script>

<style lang="stylus" scoped>
ul,
li
  list-style none
  margin 0 0 1.5rem
  padding 0 0 1.5rem
  border-bottom 1px solid #e9ecef

  .rank
    float left
    height 32px
    width 32px
    margin-top 3px
    font-weight 700
    text-align center
    line-height 32px
    color #fff
    background-color #a591ff

  .news-title
    margin-bottom 0
    margin-left 40px
    font-size 1rem

  a:hover
    color #a591ff
    text-decoration none

ul
  margin-top 1.5rem

</style>
