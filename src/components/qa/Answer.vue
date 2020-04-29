<template>
  <div :id="`answer-${answer._id}`" class="answer">
    <div class="profile-container">
      <profile-label
        :userData="answer.author"
        :dateComment="formatDate(answer.dateCreated)" />
    </div>

    <div class="content-area">
      <div
        v-if="!isEditing"
        v-html="compiledMarkdown" />

      <content-editor
        v-if="isEditing"
        v-model="answer.content"
        placeholder="Write your answer"
        ref="editor" />
    </div>

    <div class="answer-footer" v-if="isLoggedIn">
      <div class="cursor-pointer hover-highlight" :class="{ 'active': isMyVote }" @click="onVote">
        <i class="fa fa-lg" :class="{ 'fa-heart-o': !isMyVote, 'fa-heart': isMyVote }"></i>
        {{ answer.votes.length }}
      </div>

      <social-sharing
        :url="shareUrl"
        :href="shareUrl"
        :title="shareText"
        twitter-user="software_daily"
        inline-template>
        <div class="cursor-pointer hover-highlight">
          <network network="twitter">
            <i class="fa fa-lg fa-twitter" />
          </network>
        </div>
      </social-sharing>

      <div class="answer-edit" :class="{ 'is-disabled': isLoading }">
        <span v-if="isMyAnswer">
          <span
            class="link"
            @click="onDelete">
            Delete
          </span>

          <span
            class="link"
            @click="onEdit">
            {{ isEditing ? 'Cancel' : 'Edit' }}
          </span>
          <button
            v-show="isEditing"
            class="button-submit button-save"
            @click="onUpdate">
            Update Answer
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import moment from 'moment'
import { mapState, mapActions, mapGetters } from 'vuex'
import SocialSharing from 'vue-social-sharing'
import VotingArrows from '@/components/VotingArrows'
import ContentEditor from '@/components/contentEditor/ContentEditor'
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

  data () {
    return {
      isLoading: false,
      isEditing: false,
    }
  },

  components: {
    ContentEditor,
    VotingArrows,
    ProfileLabel,
    SocialSharing,
  },

  computed: {
    ...mapGetters([
      'isLoggedIn',
    ]),

    ...mapState({
      me ({ me }) {
        return me
      },

      topicpage ({ topics }) {
        return topics.topicpage
      },
    }),

    compiledMarkdown () {
      marked.setOptions({
        breaks: true
      })

      return marked(this.answer.content || '')
    },

    shareUrl () {
      const { topicpage, answer } = this
      return `${window.location.origin}/topic/${topicpage.slug}/question/${answer.question}#answer-${answer._id}`
    },

    shareText () {
      const author = this.answer && this.answer.author && this.answer.author.name
      return `Answer to ${this.question}${author ? ` by ${author}` : ''}`
    },

    isMyVote () {
      const { me = {} } = this.$store.state
      return (
        this.answer.votes.indexOf(me._id) >= 0
      )
    },

    isMyAnswer () {
      const { me = {} } = this.$store.state
      return (
        this.answer &&
        this.answer.author &&
        this.answer.author._id === me._id
      )
    }
  },

  methods: {
    ...mapActions([
      'updateAnswer',
      'deleteAnswer',
      'voteAnswer',
    ]),

    formatDate (dateCreated) {
      if (dateCreated) {
        const date = moment(dateCreated).format('MMMM Do, YYYY')
        const duration = moment(dateCreated).startOf('second').fromNow()

        return `${date} | ${duration}`
      }

      return 'Now'
    },

    onVote () {
      this.voteAnswer(this.answer)
    },

    onEdit () {
      this.isEditing = !this.isEditing
    },

    async onUpdate () {
      this.isLoading = true
      await this.updateAnswer(this.answer)
      this.onEdit()
      this.isLoading = false
    },

    async onDelete () {
      this.isLoading = true
      await this.deleteAnswer(this.answer._id)
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="stylus">
.answer {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #e9ecef;
  border-radius: 4px;

  >>> .content-editor {
    margin-bottom: 1rem;

    .CodeMirror,
    .CodeMirror-scroll {
      min-height: 130px;
    }
  }
}

.answer-footer {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  letter-spacing: 0.6px;
  font-weight: 600;

  & > .cursor-pointer {
    margin-right: 1rem;
  }
}

.answer-edit {
  flex-grow: 1;
  text-align: right;

  &.is-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
}

.cursor-pointer {
  cursor: pointer;
}

.hover-highlight:hover,
.hover-highlight.active {
  color: #a591ff;
}

.link,
.button-submit {
  margin-left: 1rem;
}
</style>
