<template>
  <div class="categories-container">
    <div class="topics-container">
      <router-link to="/popular">Most Popular</router-link>
      <router-link v-for="topic in pagesTopics" :key="topic._id" :to="{name: 'TopicPage', params: { slug: topic.slug }}">
        {{ topic.name }}
      </router-link>
      <router-link v-for="topic in postsTopics" :key="topic._id" :to="{name: 'Posts', params: { slug: topic.slug }}">
        {{ topic.name }}
      </router-link>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'home-left-panel',
  data () {
    return {
      postsTopics: [],
      pagesTopics: []
    }
  },
  mounted() {
    this.loadPostTopics()
    this.loadPageTopics()
  },
  methods: {
    loadPostTopics() {
      this.$store.dispatch('mostPosts')
        .then(result => {
          this.postsTopics = result
        })
        .catch(_ => {
          this.$toasted.error('There was a problem loading the menu', { duration : 0 })
        })
    },

    loadPageTopics() {
      this.$store.dispatch('mostRecentPages')
        .then(result => {
          this.pagesTopics = result
        })
        .catch(_ => {
          this.$toasted.error('There was a problem loading the menu', { duration : 0 })
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .categories-container
    display flex
    flex-direction column

    .topics-container

      a
        margin 10px 0
        color #808080
        text-decoration none
        display block

        &:hover
          color primary-color !important

        &.router-link-exact-active
          color #856aff !important
          font-weight 600
      
      .header-topic
        margin 20px 0

  @media (max-width 750px)
    .categories-container
      padding 10px
</style>
