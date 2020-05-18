<template>
  <write-request
    :showTitle="false"
    :canSuggest="true">

    <div v-if="!me || !me._id" class="display-content">
      You need to login first.
    </div>

    <template v-else>

      <div class="list">
        <div class="form">
          <h2 class="list-headline">Topics</h2>
          <!-- <input type="text"
            v-model="newTopic"
            class="form-control"
            placeholder="+ Add new company or topic"> -->
          <div class="list-input">
            <topics-auto-complete
              v-model="newTopic"
              placeholder="Write about an existing topic"
              :multiple="false" />
            <button
              :disabled="!newTopic"
              @click="onClickTopic(newTopic)">
              Request
            </button>
          </div>
        </div>

        <div>
          <spinner :show="loading"/>

          <button
            v-for="topic in topics"
            :key="topic._id"
            class="list-item topic-select"
            @click="onClickTopic(topic)">
            {{topic.name}}
          </button>

          <router-link to="/topic/create" class="link-button">
            <i class="fa fa-plus" /> Add Company or Topic
          </router-link>
        </div>
      </div>

      <div class="list">
        <h2 class="list-headline">Questions</h2>
        <div
          v-for="question in unansweredQuestions"
          :key="question._id">

          <div class="topicpage-header">
            <div class="post-topics">
              <router-link :to="`/topic/${question.topic.slug}`" class="topics">
                {{question.topic.name}}
              </router-link>
            </div>
          </div>

          <question
            :topicSlug="question.topic.slug"
            :answerLimit="0"
            :question="question" />

        </div>
      </div>

    </template>
  </write-request>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Question from '@/components/qa/Question'
import { TopicsAutoComplete } from '@/components/topic'
import WriteRequest from '@/views/write/WriteRequest'
import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner,
    Question,
    TopicsAutoComplete,
    WriteRequest,
  },

  data () {
    return {
      loading: false,
      showConfirmation: false,
      topics: [],
      newTopic: null,
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

      unansweredQuestions ({ topics }) {
        return topics.unansweredQuestions || []
      },
    })
  },

  methods: {
    ...mapActions([
      'getTopTopics',
      'getUnansweredQuestions',
      'setMaintainerInterest',
    ]),

    onCancelSelection() {
      this.newTopic = null
    },

    loadTopics() {
      this.loading = true
      this.getTopTopics(5).then((data) => {
        this.getUnansweredQuestions(10)
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
  margin 10px auto
  background-color transparent

.list
  padding-bottom 2rem

  .list-headline
    padding-top 1rem

  .list-item
    margin-bottom 1rem
    background-color #f8f9fa

  .list-input
    display flex
    justify-content stretch

    button
      margin 0 0 0 10px
      padding 0 20px
      color #ffffff
      text-transform none
      font-weight 700
      background-color #a591ff
      border-radius 4px

      &[disabled]
        color #ccc
        background-color #f8f9fa

  .form
    margin-bottom 10px

  button
    border 0
    background-color transparent
    display block
    margin 10px auto
    font-size 16px
    text-align center
    text-transform uppercase
    color #1a0dab

  .topic-select
    display inline-block
    margin 0 10px 10px 0
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

.post-topics
  margin-bottom 0.5rem

.link-button
  cursor pointer
  display inline-block
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

.topics
  cursor pointer
  margin 2px 10px 8px 0
  padding 3px 9px
  font-size .8rem
  text-transform uppercase
  color #666
  background-color #f7f7f7
  border-radius 2px

  &:hover
    color #a591ff
    text-decoration none

</style>
