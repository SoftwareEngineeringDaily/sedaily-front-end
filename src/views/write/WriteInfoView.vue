<template>
  <div class="write-view">
    <h1>Write on Software Daily</h1>
    <p>
      We are looking for volunteer writers to summarize the topics on Software Daily.
      If you want to write about one of the following topics, select one of the topics below or suggest your own topic.
    </p>
    <div v-if="message" class="display-content">
      <span class="message">{{message}}</span>
    </div>
    <template v-else>
      <template v-if="loading">
        <spinner :show="loading"/>
      </template>
      <template v-else>
        <form class="display-content" v-on:submit.prevent="submitNewTopic">
          <input type="text"
            v-model="newTopic"
            class="form-control"
            placeholder="Sugest new topic">
        </form>
        <div class="display-content topics-block">
          <button
            v-for="topic in topics" 
            :key="topic._id"
            @click="onClickTopic(topic)">
            {{topic.name}}
          </button>
        </div>
      </template>
    </template>    
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Spinner from '@/components/Spinner.vue'
export default {
  components: {
    Spinner
  },
  data () {
    return {
      loading: false,
      topics: [],
      newTopic: '',
      message: ''
    }
  },
  mounted() {
    this.loadTopics()
  },
  computed: {
    ...mapState({    
      me (state) {
        return state.me
      },
    })
  },
  methods: {
    ...mapActions(['getTopTopics', 'setMaintainerInterest']),
    loadTopics() {
      this.loading = true
      this.getTopTopics(200).then((data) => {
        this.topics = data
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    onClickTopic (topic) {
      if (!this.me || !this.me._id) return this.message = 'Please log in first'

      this.loading = true
      const data = {
        topicName: topic.name,
        userName: this.me.name,
        userEmail: this.me.email
      }

      this.setMaintainerInterest(data).then((data) => {
        this.message = 'Great! We will be in touch with you.'
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    submitNewTopic () {
      if (!this.me || !this.me._id) return this.message = 'Please log in first'

      this.loading = true
      const data = {
        topicName: (''.trim) ? this.newTopic.trim() : this.newTopic,
        userName: this.me.name,
        userEmail: this.me.email
      }

      this.setMaintainerInterest(data).then((data) => {
        this.message = 'Great! We will be in touch with you.'
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  .write-view
    padding 20px

    h1,h2,h3,h4
      font-weight 200
      margin-bottom 30px
    
    .spinner
      margin 0 auto
      display block

    .display-content
      padding 20px
      background-color #f8f9fa
      min-width 400px
      width 50vw
      margin 10px auto
      text-align center
      
      .message
        font-size 16px

    .topics-block

      button
        border 0
        background-color transparent
        display block
        margin 10px auto
        font-size 16px
        text-transform uppercase
        color #1a0dab

</style>
