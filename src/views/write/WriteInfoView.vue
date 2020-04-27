<template>
  <write-request>
    <spinner :show="loading"/>

    <div v-if="!me || !me._id" class="display-content">
      You need to login first.
    </div>
    <template v-else>

      <form class="display-content" v-on:submit.prevent="selectNewTopic">
        <input type="text"
          v-model="newTopic"
          class="form-control"
          placeholder="Suggest new topic">
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
  </write-request>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import WriteRequest from '@/views/write/WriteRequest'
import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner,
    WriteRequest,
  },

  data () {
    return {
      loading: false,
      showConfirmation: false,
      topics: [],
      newTopic: '',
      selectedTopic: ''
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
    ...mapActions([
      'getTopTopics',
      'setMaintainerInterest',
    ]),

    onCancelSelection() {
      this.selectedTopic = ''
      this.newTopic = ''
    },

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

    onClickTopic(topic) {
      this.selectedTopic = topic.name
      this.$nextTick(() => {
        this.requestTopicOwnership()
      })
    },

    selectNewTopic() {
      this.selectedTopic = (''.trim) ? this.newTopic.trim() : this.newTopic
      this.$nextTick(() => {
        this.requestTopicOwnership()
      })
    },

    async requestTopicOwnership() {
      this.saving = true

      const data = {
        topicName: this.selectedTopic,
        userName: this.me.name,
        userEmail: this.me.email,
      }

      try {
        await this.setMaintainerInterest(data)
        this.$toasted.success('Great! We will be in touch with you.', { duration : 8000 })
      }
      catch (e) {
        this.$toasted.error((e.response) ? e.response.data : e, { duration : 0 })
      }

      if (typeof this.onCancelSelection === 'function') {
        this.onCancelSelection()
      }

      this.saving = false
    },
  }
}
</script>

<style lang="stylus" scoped>
  .display-content
    padding 20px
    background-color #f8f9fa
    margin 10px auto
    text-align center

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
