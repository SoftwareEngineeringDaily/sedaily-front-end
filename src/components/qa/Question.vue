<template>
  <div class="question" v-if="question">
    <router-link
      :to="{ path: `/topic/${topicSlug}/question/${question._id}` }">
      <h3>{{question.content}}</h3>
    </router-link>

    <answer
      v-for="answer in answers"
      :key="answer._id"
      :question="question.content"
      :answer="answer" />

    <div class="question-footer">
      <div
        class="link"
        v-show="!hasAnswered"
        @click="showAnswerEdit">
        Add Answer
      </div>

      <span v-if="question.answers.length > answerLimit">|</span>
      <router-link
        class="link"
        v-if="question.answers.length > answerLimit"
        :to="{ path: `/topic/${topicSlug}/question/${question._id}` }">
        View {{question.answers.length - answerLimit}} More Answer{{(question.answers.length - answerLimit) > 1 ? 's' : ''}}
      </router-link>
    </div>

    <div class="answer" :class="{ 'is-disabled': isLoading }" v-show="isAnswering">
      <content-editor
        v-model="content"
        placeholder="Write your answer"
        ref="editor" />

      <div class="answer-footer">
        <button
          @click="onSubmitAnswer"
          :disabled="isLoading"
          class="button-submit button-save">
          <spinner :show="isLoading" />
          Submit Answer
        </button>
        <button
          @click="showAnswerEdit"
          class="button-submit button-cancel">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import Answer from './Answer'
import Spinner from '@/components/Spinner'
import ContentEditor from '@/components/contentEditor/ContentEditor'
import CommentQuote from '@/components/comment/CommentQuote'

export default {
  name: 'question',

  props: {
    question: {
      type: Object,
    },
    answerLimit: {
      type: Number,
    },
    topicSlug: {
      type: String,
    },
  },

  data () {
    return {
      content: '',
      isAnswering: false,
      isLoading: false,
    }
  },

  components: {
    Answer,
    Spinner,
    ContentEditor,
    CommentQuote,
  },

  computed: {
    ...mapState({
      me (state) {
        return state.me
      },
    }),

    answers () {
      return this.question ?
        this.question.answers.slice(0, this.answerLimit) :
        []
    },

    hasAnswered () {
      const userId = this.me && this.me._id

      return (
        userId &&
        this.answers.filter(a => (
          a.author && a.author._id === userId && !a.deleted
        )).length
      )
    },
  },

  methods: {
    ...mapActions([
      'createAnswer',
    ]),

    showAnswerEdit () {
      this.isAnswering = !this.isAnswering
    },

    async onSubmitAnswer () {
      this.isLoading = true

      await this.createAnswer({
        question: this.question._id,
        content: this.content,
      })

      this.showAnswerEdit()
      this.isLoading = false
    },
  },
}
</script>

<style scoped lang="stylus">
.question {
  margin-bottom: 1rem;
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 4px;
}

.question h3 {
  margin-bottom: 0;
}

.question-footer {
  margin-top: 1rem;
  text-align: right;

  > * {
    display: inline-block;
  }

  span {
    color: #e9ecef;
  }

  span,
  *:last-child {
    margin-left: 10px;
  }
}

.link,
>>> .link {
  cursor: pointer;
  font-weight: 700;
  color: #a591ff;
}

.link:hover {
  text-decoration: underline;
}

.answer {
  margin-top: 1rem;

  .CodeMirror,
  .CodeMirror-scroll {
    min-height: 130px;
  }

  &.is-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.answer-footer {
  display: flex;
  padding-top: 1rem;
}

.button-submit {
  margin-right: 0.5rem;

  .spinner {
    width: 22px;
    height: 22px;
    display: inline-block;

    >>> circle {
      stroke: #ffffff;
    }
  }
}

.button-save {
  min-width: 120px;
}

.button-cancel {
  color: #222;
  background-color: transparent;
}
</style>
