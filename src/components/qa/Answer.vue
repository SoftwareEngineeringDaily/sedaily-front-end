<template>
  <div :id="`answer-${answer._id}`" class="answer">
    <div class="profile-container">
      <profile-label
        :userData="answer.author"
        :dateComment="formatDate(answer.dateCreated)" />
    </div>
    <answer-content
      :question="question"
      :answer="answer" />
  </div>
</template>

<script>
import moment from 'moment'
import AnswerContent from '@/components/qa/AnswerContent'
import ProfileLabel from '@/components/profile/ProfileLabel'

export default {
  name: 'answer',

  props: {
    question: {
      type: String,
    },
    answer: {
      type: Object,
    }
  },

  components: {
    AnswerContent,
    ProfileLabel,
  },

  methods: {
    formatDate (dateCreated) {
      if (dateCreated) {
        const date = moment(dateCreated).format('MMMM Do, YYYY')
        const duration = moment(dateCreated).startOf('second').fromNow()

        return `${date} | ${duration}`
      }

      return 'Now'
    },
  }
}
</script>

<style scoped lang="stylus">
.answer {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e9ecef;
  border-radius: 4px;
}
</style>
