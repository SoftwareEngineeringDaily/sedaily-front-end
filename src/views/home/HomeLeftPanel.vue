<template>
  <div class="categories-container">
    <div class="topics-container">
      <router-link to="/popular">Most Popular</router-link>
      <router-link v-for="topic in recentTopicPages" :key="topic._id" :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
        {{topic.name}}
      </router-link>
      <router-link v-for="topic in postsTopics" :key="topic._id" :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
        {{topic.name}}
      </router-link>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'home-left-panel',

  mounted() {
    this.$store.dispatch('mostRecentPages')
    this.$store.dispatch('mostPosts')
  },

  computed: {
    ...mapState({
      recentTopicPages: ({ topics }) => {
        return topics.recentTopicPages
      },

      mostPosts: ({ topics }) => {
        return topics.mostPosts
      },
    }),

    postsTopics () {
      return this.mostPosts
        .filter(post => (
          this.recentTopicPages.filter(p => p.name !== post.name).length
        ))
        .sort((a, b) => b.dateUpdated - a.dateUpdated)
    },
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
