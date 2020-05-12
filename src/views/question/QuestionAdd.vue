<template>
  <topic-page-template>
    <template v-slot:content class="question">
      <div class="topicpage-header">
        <div class="post-topics">
          <router-link :to="`/topic/${topicpage.slug}`" class="topics">
            {{topicpage.name}}
          </router-link>
        </div>
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
import { mapState, mapActions, mapGetters } from 'vuex'
import { TopicPageTemplate } from '@/views/topic'
import Spinner from '@/components/Spinner'

export default {
  name: 'question-add',

  components: {
    Spinner,
  },

  data () {
    return {
      isLoading: false,
    }
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
      'getEntityQuestions',
    ]),
  }
}
</script>

<style scoped lang="stylus">

</style>
