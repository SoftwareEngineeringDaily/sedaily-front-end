<template>
  <div v-if="topics.length" class="profile-topics">
    <h3>Maintained Topics</h3>
    <router-link v-for="topic in topics" :key="topic._id" :to="getTopicPath(topic)">
      <div class="name">{{topic.name}}</div>
      <div v-if="topic.draft" class="draft">Draft</div>
    </router-link>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'profile-topics',
  props: {
    user: {
      type: Object
    }
  },
  data () {
    return {
      topics: [],
    }
  },
  beforeMount () {
    this.getTopics()
  },
  methods: {
    ...mapActions(['fetchUserTopics']),

    getTopics () {
      if (!this.user || !this.user._id) return
      this.fetchUserTopics({ userId: this.user._id }).then((data) => {
        this.setTopics(data)
      }).catch((e) => {
        this.$toasted.error(e, { duration : 0 })
      })
    },

    setTopics (data) {
      this.setDrafts(data)
      this.topics = data
    },

    setDrafts (data) {
      const { localStorage } = window
      if (!localStorage) return

      data.forEach(topic => {
        const name = `edit.topicpage.${topic.slug}`
        topic.draft = localStorage.getItem(name)
      });

      data.sort(a => a.draft ? -1 : 1)
    },

    getTopicPath (topic) {
      return `/topic/${topic.slug}/edit`
    }
  }
}
</script>

<style scoped lang="stylus">
@import '../../css/variables'
  
.profile-topics
  padding 0 10px

  h3
    position relative
    font-size 20px
    padding-bottom 0.8rem
    font-weight 600
  
  a
    display flex
    justify-content space-between
    align-items center
    padding 10px
    margin-bottom 9px
    background-color #f8f9fa
    text-decoration none
    color #222

    &:hover .name
      text-decoration underline

    .draft
      color #999
      font-size 12px
</style>
