<template>
  <div class="categories-container">
    <div v-if="showUserTopics" class="topics-container">
      <h4>Favourite</h4>
      <router-link v-for="topic in showTopics" :key="topic._id" :to="getTopicRoute(topic)">
        {{ topic.name }}
      </router-link>
    </div>
    <div class="topics-container">
      <router-link to="/popular">Most Popular</router-link>
      <router-link v-for="topic in showMostPopular" :key="topic._id" :to="getTopicRoute(topic)">
        {{ topic.name }}
      </router-link>
    </div>
</div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'home-left-panel',
  computed: {
    ...mapState(["topics"]),
    showTopics() {
      return this.topics.user;
    },
    showMostPopular() {
      return this.topics.mostPopular;
    },
    showUserTopics() {
      const { me, topics } = this.$store.state
      if ((Object.entries(me).length !== 0 && me.constructor === Object) && topics.user !== null) {
        if (topics.user.length !== 0) {
          return true
        }
      } else {
        return false
      }
    }
  },
  created() {
    this.$store.commit("setActiveType", { type: this.type });
    this.$store.dispatch("mostPopular");
  },
  methods: {
    getTopicRoute(topic) {
      return (topic.topicPage && topic.maintainer) ? `/topic/${topic.slug}` : `/posts/${topic.slug}`
    },
  }
}
</script>

<style lang="stylus" scoped>
  .categories-container
    padding-top 2rem
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

  @media (max-width 750px)
    .categories-container
      padding 10px
</style>
