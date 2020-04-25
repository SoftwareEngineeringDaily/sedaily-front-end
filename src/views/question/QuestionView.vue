<template>
  <topic-page-template>
    <template v-slot:content class="question">
      <div class="topicpage-header">
        <h1 class="header-title">
          <router-link :to="`/topic/${topicpage.slug}`">
            {{topicpage.name}}
          </router-link>
        </h1>
      </div>

      <question
        v-for="question in questions"
        :key="question._id"
        :topicSlug="topicpage.slug"
        :question="question" />

      <spinner :show="isLoading"/>

    </template>
  </topic-page-template>
</template>

<script>
import find from 'lodash/find'
import isArray from 'lodash/isArray'
import { mapState, mapActions } from 'vuex'
import { TopicPageTemplate } from '@/views/topic'
import Spinner from '@/components/Spinner'
import Answer from '@/components/qa/Answer'
import Question from '@/components/qa/Question'

export default {
  name: 'question-view',

  components: {
    Spinner,
    Answer,
    Question,
    TopicPageTemplate,
  },

  data () {
    return {
      isLoading: false,
    }
  },

  async mounted () {
    await this.loadTopic()
    this.loadQuestions()
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      },

      questions ({ topics }) {
        const { questionId } = this.$route.params
        return topics.questions.filter(q => q._id === questionId)
      },

      topicpage ({ topics }) {
        return topics.topicpage
      },
    }),
  },

  methods: {
    ...mapActions([
      'getTopicPage',
      'getQuestions',
    ]),

    scrollToAnswer () {
      const { hash } = window.location

      // Invalid element selector
      if (hash && !/[a-zA-Z]/g.test(hash[1])) {
        return
      }

      const elementEl = this.$el.querySelector(hash)

      if (!elementEl) {
        return
      }

      const { top } = elementEl.getBoundingClientRect()
      const offset = 100

      setTimeout(() => {
        window.scrollTo(0, top + offset)
      }, 300)

      elementEl.classList.add('answer-highlight')
    },

    async loadQuestions () {
      const { questionId } = this.$route.params
      const { _id } = this.topicpage
      const hasQuestions = (
        _id &&
        isArray(this.questions) &&
        this.questions.length > 0 &&
        find(this.questions, { entityId: _id })
      )

      if (!_id || hasQuestions) {
        return
      }

      this.isLoading = true
      await this.getQuestions(_id)
      this.scrollToAnswer()
      this.isLoading = false
    },

    async loadTopic () {
      const { slug } = this.$route.params

      if (!this.topicpage || this.topicpage && this.topicpage.slug !== slug) {
        this.isLoading = true
      }

      await this.getTopicPage(slug)
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="stylus">
@keyframes answer-highlight {
  0% { background-color: #FDF991; }
  100% { background-color: #e9ecef; }
}

>>> .answer-highlight {
  animation: answer-highlight 3s ease-in 0s;
}
</style>
