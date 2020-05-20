<template>
  <div class="categories-container">
    <div class="topics-container">

      <topic-create />

      <ul class="topics-scroll">
        <li v-for="topic in recentTopicPages" :key="topic._id">
          <router-link :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
            {{topic.name}}
          </router-link>
        </li>
        <li v-for="topic in postsTopics" :key="topic._id">
          <router-link :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
            {{topic.name}}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TopicCreate from '@/components/topic/TopicCreate'

export default {
  name: 'home-left-panel',

  components: {
    TopicCreate,
  },

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

.topics-container .link-button
  cursor pointer
  display inline-block
  margin 0 0 20px -12px
  padding 4px 12px
  font-size 14px
  font-weight 700
  color #a591ff
  border 2px solid #a591ff
  border-radius 18px

  &:hover
    text-decoration none
    color #ffffff
    background-color #a591ff

.topics-scroll
  list-style none
  padding 0
  text-align left

  a
    display inline-block
    margin 0 0 10px
    padding 4px 12px
    font-size 14px
    text-decoration none
    text-transform uppercase
    color #ffffff
    background-color #222
    border-radius 2px

    &:hover
      color #ffffff
      background-color #a591ff

    &.router-link-exact-active
      color #856aff !important
      font-weight 600

.header-topic
  margin 20px 0

>>> .topicpage-create .link-button
  margin 0 0 20px -12px

@media (max-width 750px)
  .topics-scroll
    overflow auto
    white-space nowrap
    padding-left 10px

    li
      display inline-block
      margin 0 10px 0 0

  .topics-container .link-button
    margin 0 0 10px 6px

  .categories-container
    padding 10px

</style>
