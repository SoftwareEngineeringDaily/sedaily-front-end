<template>
  <div class="answer-post">
    <p>{{answer.author.name}} left an answer on
      <router-link
        v-if="topicSlug"
        :to="`/topic/${topicSlug}/question/${this.answer.question._id}`">
        <strong>"{{question}}"</strong>
      </router-link>
      <strong v-else>"{{question}}"</strong>
    </p>

    <answer-content
      :answer="answer"
      :question="question"
      :topicSlug="topicSlug"
      :canEdit="false" />
  </div>
</template>

<script>
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import { mapActions } from 'vuex'
import { PostMeta, PostTitle, PostAuthor } from '@/components/post'
import AnswerContent from '@/components/qa/AnswerContent'

export default {
  name: 'answer-preview',

  components: {
    PostMeta,
    AnswerContent,
  },

  props: {
    answer: {
      type: Object,
    },
  },

  data () {
    return {
      topicSlug: '',
    }
  },

  async mounted () {
    const hasQuestion = (this.answer && isObject(this.answer.question))

    if (this.answer && isArray(this.answer.topics) && this.answer.topics[0]) {
      this.topicSlug = this.answer.topics[0].slug
    }

    if (this.topicSlug || !hasQuestion) {
      return
    }

    try {
      const { slug = '' } = await this.getTopic({
        topicId: this.answer.question.entityId,
      })

      this.topicSlug = slug
    }
    catch (e) {

    }
  },

  computed: {
    question () {
      return this.answer.question ? this.answer.question.content : ''
    },
  },

  methods: {
    ...mapActions([
      'getTopic',
    ]),
  }
}
</script>

<style lang="stylus" scoped>
.answer-post
  padding 1rem
  background-color #ffffff
  border 2px solid #e9ecef

  @media (max-width: 750px)
    border-right none
    border-left none

.answer-content
  padding 1rem
  background-color #e9ecef

strong
  display inline

</style>
