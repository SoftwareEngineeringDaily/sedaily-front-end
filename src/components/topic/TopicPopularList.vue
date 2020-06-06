<template>
  <ul class="topic-popular-list">
    <li class="topic-item" v-for="topic in topics.topTopics" :key="topic._id">
      <router-link :to="{ name: 'TopicPage', params: { slug: topic.slug } }">
        {{topic.name}}
      </router-link>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'topic-popular-list',

  async mounted () {
    const { topTopics } = this.topics

    if (Array.isArray(topTopics) && topTopics.length) {
      return
    }

    try {
      await this.getTopTopics(10)
    }
    catch (err) {
      this.$toasted.error((err.response) ? err.response.data : err)
    }
  },

  computed: {
    ...mapState([
      'topics',
    ]),
  },

  methods: {
    ...mapActions([
      'getTopTopics',
    ]),
  }
}
</script>

<style lang="stylus" scoped>
ul
  padding-top 1.5rem

ul li
  padding-bottom 10px

ul,
li
  list-style none
  margin-left 0
  padding-left 0

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

</style>
