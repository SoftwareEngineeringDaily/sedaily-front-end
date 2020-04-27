<template>
  <div class="write-view">
    <h1>Write on Software Daily</h1>
    <p>
      We are looking for volunteer writers to summarize the topics on Software Daily.
      If you want to write about one of the following topics, select one of the topics below or suggest your own topic.
    </p>

    <button class="learn" @click="toggleLearn">Learn more</button>

    <slot></slot>

    <modal v-show="showLearn">
      <h2 slot="header"></h2>
      <div slot="body">
        <div>
          <p>If you are listening to lots of episodes of Software Daily, you can write about the topics in the show. It will help us grow our content, and help you retain information.</p>
          <p>A topic page should be:</p>
          <ul>
            <li>brief (2-3 pages; you would want to read it on an airplane or on a short 15 minute commute)</li>
            <li>high-level (it should read like an executive summary, not a tutorial)</li>
            <li>informative (an unbiased presentation of the topic)</li>
          </ul>
          <p>Here are a few examples:</p>
          <router-link to="/topic/container-orchestration-wars">Container Orchestration Wars</router-link><br>
          <router-link to="/topic/apache-spark">Apache Spark</router-link>
        </div>
      </div>
      <div slot="footer">
        <button class="cancel" @click="showLearn = false">Close</button>
      </div>
    </modal>

    <modal v-show="showConfirmation">
      <h2 slot="header"></h2>
      <div slot="body">
        Confirm selection of <span class="topic">{{selectedTopic}}</span> topic?
      </div>
      <div slot="footer">
        <button class="cancel" @click="onCancelSelection">Close</button>
        <button :disabled="saving" class="button-submit" @click="requestTopicOwnership">Submit</button>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import modal from '@/components/ModalComponent'

export default {
  name: 'write-request',

  components: {
    modal,
  },

  props: {
    selectedTopic: {
      type: String,
    },
    showConfirmation: {
      type: Boolean,
    },
    onCancelSelection: {
      type: Function,
    },
  },

  data () {
    return {
      loading: false,
      saving: false,
      showLearn: false,
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
      'setMaintainerInterest'
    ]),

    toggleLearn() {
      this.showLearn = !this.showLearn;
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
        this.showConfirmation = true
      })
    },

    selectNewTopic() {
      this.selectedTopic = (''.trim) ? this.newTopic.trim() : this.newTopic
      this.$nextTick(() => {
        this.showConfirmation = true
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
  .write-view
    h1,h2,h3,h4
      font-weight 200
      margin-bottom 30px

    .spinner
      margin 0 auto
      display block

    .learn
      color #a591ff
      font-weight 600
      margin 0 0 2rem
      padding 0
      border 0
      background-color transparent
      font-size 16px

      &:hover
        color #222
        text-decoration underline

    .cancel
      font-weight 600
      color #9b9b9b
      margin 0
      padding 0
      border 0
      background-color transparent
      font-size 16px

    >>> .modal
      height unset
      min-height unset

      .modal-header
        display none

      .modal-body
        padding 30px
        overflow auto

      a
        color #1a0dab

    .topic
      color #a591ff

    .button-submit
      margin-left 20px

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
