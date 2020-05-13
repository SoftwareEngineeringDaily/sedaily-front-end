<template>
  <div class="categories-container">
    <div class="topics-container">
      <router-link to="/topic/create" class="link-button">
        + Add Company or Topic
      </router-link>

      <div class="topics-scroll">
        <router-link v-for="topic in recentTopicPages" :key="topic._id" :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
          {{topic.name}}
        </router-link>
        <router-link v-for="topic in postsTopics" :key="topic._id" :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
          {{topic.name}}
        </router-link>
      </div>
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
  .topics-scroll
    overflow auto
    white-space nowrap

    a
      display inline-block
      margin-right 0.8rem
      padding 4px 12px
      font-size 14px
      text-transform uppercase
      color #ffffff
      background-color #222
      border-radius 2px

  .topics-container .link-button
    cursor pointer
    display inline-block
    margin 0 0 4px
    padding 4px 12px
    font-size 14px
    color #a591ff
    border 1px solid #a591ff
    border-radius 18px

    &:hover
      color #ffffff
      background-color #a591ff

  .categories-container
    padding 10px

</style>
