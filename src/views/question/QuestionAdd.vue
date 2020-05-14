<template>
  <div class="question-add">
    <b-form-input
      placeholder="Create a question"
      v-model="questionText"
      @keyup.enter="addQuestion"
    />
    <button class="button-submit" @click="addQuestion">
      <spinner :show="saving"/>
      Submit
    </button>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import Spinner from '@/components/Spinner'

export default {
  name: 'question-add',

  components: {
    Spinner,
  },

  props: {
    entity: {
      type: Object
    },
    entityType: {
      type: String
    }
  },

  data () {
    return {
      saving: false,
      questionText: '',
    }
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      },
    }),
  },

  methods: {
    ...mapActions(['createQuestion']),

    addQuestion () {
      const content = this.questionText.trim()
      if (!content || this.saving) return

      const data = {
        content,
        entityId: this.entity._id,
        entityType: this.entityType
      }
      
      this.saving = true      
      this.createQuestion(data).then((response) => {
          this.$emit('onQuestionAdded')
          this.questionText = ''
          this.$toasted.success('Question created', { duration : 6000 })
        })
        .catch((e) => {
          this.$toasted.error((e.response) ? msg : e.response.data, { duration : 0 })
        })
        .finally(() => {
          this.saving = false
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.question-add
  padding 20px
  margin 10px 0
  background-color #f8f9fa
  overflow hidden

  input
    margin-bottom 10px
    outline none
    font-size 14px

    &:focus
      outline none
      border 0
      -webkit-box-shadow 0 0 3px 3px rgba(165,145,255,0.4)
      box-shadow 0 0 3px 3px rgba(165,145,255,0.4)

  .button-submit
    float right

    .spinner
      width 18px
      height 18px

      >>> circle
        stroke #ffffff
</style>
