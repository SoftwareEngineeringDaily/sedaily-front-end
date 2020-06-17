<template>
  <write-request
    :showTitle="false"
    :canSuggest="true">

    <div class="write-info-view">
      <div class="list">
        <div class="form">
          <div class="list-input">
            <topics-auto-complete
              v-model="newTopic"
              placeholder="Search an existing topic to write about"
              :multiple="false" />
            <button
              :disabled="!newTopic"
              @click="onClickTopic(newTopic)">
              <span v-if="hasMaintainers(newTopic)">
                View
              </span>
              <span v-else>
                Write
              </span>
            </button>
          </div>
        </div>

        <spinner :show="loading"/>

        <strong class="list-label">Suggested topics</strong>

        <div v-if="!loading" class="flex">
          <button
            v-for="topic in topics"
            :key="topic._id"
            class="list-item topic-select"
            @click="onClickTopic(topic)">
            {{topic.name}}
          </button>

          <topic-create />
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
            :question="question"
            :canAnswer="false" />

        </div>
      </div>
    </div>

  </write-request>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Question from '@/components/qa/Question'
import { TopicsAutoComplete, TopicCreate } from '@/components/topic'
import WriteRequest from '@/views/write/WriteRequest'
import Spinner from '@/components/Spinner'

export default {
  components: {
    Spinner,
    Question,
    TopicCreate,
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
    ...mapGetters([
      'isLoggedIn'
    ]),

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
      'setMaintainer',
    ]),

    loadTopics() {
      this.loading = true
      this.getTopTopics(5).then((data) => {
        this.getUnansweredQuestions(10)
        this.topics = data
      }).catch((e) => {
        this.$toasted.error((e.response) ? e.response.data : e, { duration: 0 })
      }).finally(() => {
        this.loading = false
      })
    },

    hasMaintainers (topic) {
      return (
        topic &&
        topic.maintainers &&
        topic.maintainers.length > 0
      )
    },

    onCancelSelection() {
      this.newTopic = null
    },

    onClickTopic(topic) {
      if (this.hasMaintainers(topic)) {
        return this.$router.history.push(`/topic/${topic.slug}`)
      }

      if (!this.isLoggedIn) {
        return this.$toasted.success('Please, login or sign up first.', {
          action: [
            {
                text: 'Sign In',
                onClick : (e, toastObject) => {
                    this.$router.history.push('/login');
                    toastObject.goAway(0);
                },
            },
            {
                text: 'Close',
                onClick : (e, toastObject) => {
                    toastObject.goAway(0);
                },
            },
          ],
          duration: 0,
        })
      }

      this.selectedTopic = topic.slug
      this.$nextTick(() => {
        this.requestTopicOwnership()
      })
    },

    async requestTopicOwnership() {
      this.saving = true

      const data = {
        topicSlug: this.selectedTopic,
        event: 'selfAssign'
      }

      try {
        await this.setMaintainer(data)
        this.$router.history.push(`/topic/${this.selectedTopic}/edit`)
      }
      catch (e) {
        this.$toasted.error((e.message) ? e.message : e, { duration: 0 })
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

.flex
  display flex
  flex-wrap wrap
  align-items center

.list-label
  display block
  margin-top 14px
  margin-bottom 4px

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
  background-color transparent
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

>>> .topicpage-create .link-button
  margin-bottom 10px
  background-color transparent

@media (max-width 750px)
  .write-info-view
    padding 0 1rem

</style>
