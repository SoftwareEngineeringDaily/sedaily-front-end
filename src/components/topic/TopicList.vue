<template>
  <div class="topics-container">

    <topic-create />

    <ul class="topics-scroll">
      <li v-for="topic in recentTopicPages" :key="topic._id">
        <router-link :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
          {{topic.name}}
        </router-link>
      </li>
      <li v-for="topic in mostPostsTopics" :key="topic._id" class="most">
        <router-link :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
          {{topic.name}}
        </router-link>
      </li>
    </ul>

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

    mostPostsTopics () {
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
  display flex
  align-items center
  padding 1.5rem 0 1.6rem
  border-top 4px solid #222
  border-bottom 1px solid #222

.link-button
  cursor pointer
  display inline-block
  margin 0 0 20px -12px
  padding 4px 10px
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
  overflow auto
  white-space nowrap
  margin 0 0 -20px 10px
  padding 0 0 20px
  text-align left

  li
    display inline-block
    margin 0 10px 0 0

  a
    display inline-block
    margin 0
    padding 4px 10px
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

>>> .topicpage-create
  flex-grow 1

  .link-button
    margin 0
    white-space nowrap

@media (max-width 750px)
  .topics-container
    padding 1rem 0

  .topics-container .link-button
    margin 0 0 10px 6px

  .categories-container
    padding 10px

</style>
