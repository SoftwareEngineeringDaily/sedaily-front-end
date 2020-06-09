<template>
  <div class="edit-questions">

    <h3>Questions</h3>

    <div class="new-block">
      <textarea
        class="form-control"
        rows="2"
        placeholder="New question(s)"
        v-model="content"
        :disabled="saving"
      />
      <button :disabled="saving" class="button-submit" @click="onClickSaveNew">
        <spinner :show="saving"/>
        Save Questions
      </button>
    </div>

    <spinner :show="loadingQuestions"></spinner>

    <draggable v-model="questions" draggable=".question-block" @end="saveQuestionOrder">
      <div class="question-block" v-for="question in questions" :key="question._id">
        <p v-if="!question.editing">{{question.content}}</p>
        <textarea v-else
          class="form-control"
          rows="2"
          placeholder="New question"
          v-model="question.content"
          :disabled="question.saving"
        />
        <div class="bottom-bar">
          <div class="info">
            <span class="answers">{{question.answers.length}} Answers</span>
          </div>
          <div class="buttons">
            <template v-if="!question.editing">
              <button
                @click="onClickDelete(question)"
                :disabled="question.saving"
                class="clean"
              >Delete</button>
              <button @click="setEditing(question)" class="clean">Edit</button>
            </template>
            <template v-else>
              <button class="clean" @click="setEditing(question)">Cancel</button>
              <button class="button-submit" @click="onClickSave(question)">
                <spinner :show="question.saving"/> Save
              </button>
            </template>
          </div>
        </div>
      </div>
    </draggable>

  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState, mapActions } from 'vuex'
import isNumber from 'lodash/isNumber'
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'edit-questions',

  components: {
    Spinner,
    draggable,
  },

  props: {
    entityId: {
      type: String
    },
    entityType: {
      type: String
    }
  },

  data () {
    return {
      loadingQuestions: false,
      saving: false,
      questions: [],
      content: ''
    }
  },

  beforeMount () {
    this.getQuestions()
  },

  methods: {
    ...mapActions([
      'getEntityQuestions',
      'createQuestionBatch',
      'updateQuestion',
      'updateQuestionOrder',
      'deleteQuestion'
    ]),

    async getQuestions () {
      const { entityId, entityType } = this

      if (!entityId || !entityType) {
        return
      }

      this.loadingQuestions = true

      try {
        const data = await this.getEntityQuestions({ entityId, entityType })
        this.prepareQuestions(data)
      }
      catch (e) {
        this.$toasted.error(e.response.data)
      }

      this.loadingQuestions = false
    },

    prepareQuestions (questions) {
      this.questions = questions
        .map((question, index) => {
          return {
            ...question,
            order: isNumber(question.order) ? question.order : index,
            editing: false,
            saving: false
          }
        })
        .sort((a, b) => a.order - b.order)
    },

    async onClickSaveNew () {
      const { entityId, entityType } = this
      const content = this.content.trim()

      if (!content) {
        return
      }

      const questions = content.split('\n')
      const options = {
        questions,
        startOrder: this.questions.length - 1 || 0,
        entityId,
        entityType
      }

      this.saving = true

      try {
        await this.createQuestionBatch(options)
        this.content = ''
        this.getQuestions()
      }
      catch (e) {
        this.$toasted.error(e.response.data)
      }

      this.saving = false
    },

    async saveQuestionOrder () {
      const { entityId, entityType } = this
      const questions = this.questions.map((q, index) => ({
        id: q._id,
        order: index,
      }))

      const options = {
        questions,
        entityId,
        entityType
      }

      this.saving = true

      try {
        await this.updateQuestionOrder(options)
      }
      catch (e) {
        this.$toasted.error(e.response.data)
      }

      this.saving = false
    },

    setEditing (question) {
      question.editing = !question.editing
    },

    onClickSave (question) {
      const content = question.content.trim()
      if (!content) return

      question.saving = true
      this.updateQuestion({ content, questionId: question._id }).then((data) => {
        this.getQuestions()
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        question.saving = false
      })
    },

    onClickDelete (question) {

      question.saving = true
      this.deleteQuestion({ questionId: question._id }).then((data) => {
        this.getQuestions()
      }).catch((e) => {
        this.$toasted.error(e.response.data, { duration : 0 })
      }).finally(() => {
        question.saving = false
      })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import '~@/css/variables'

  .edit-questions
    margin 40px 0

    .spinner
        margin: 0 auto;
        display: inherit;

    .button-submit
      height 32px

      .spinner
        width 22px
        height 22px

        >>> circle
          stroke #ffffff

    h3
      margin-bottom 20px

    .new-block
      padding 10px
      border 1px solid #cecece
      border-radius 3px
      margin-bottom 20px

    .question-block
      padding 10px
      margin-bottom 10px
      background-color #f8f9fa

      p
        cursor move
        color #666
        font-size 16px

      .bottom-bar
        display flex
        align-items center
        margin-top 5px

        .info
          flex 1

          .answers
            color #888
            font-size 12px

        .buttons
          button
            margin 0

          .clean
            border 0
            background-color transparent
            color main-purple
            margin-left 10px
</style>
