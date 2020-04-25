<template>
  <div class="question">

    <spinner :show="loading"/>

    <div class="topicpage-header">
      <h1 class="header-title">
        {{topicData.name}}
        <router-link
          v-if="isMaintainer"
          :to="{name: 'TopicPageEdit', params: $route.params.slug}"
          class="edit-link">
          Edit
        </router-link>
      </h1>
    </div>

    <answer
      v-for="answer in question.answers"
      :key="answer._id"
      :answer="answer" />

  </div>
</template>

<script>
import Spinner from '@/components/Spinner'
import Answer from '@/components/qa/Answer'

export default {
  name: 'question',
  components: {
    Spinner,
    Answer,
  },
}
</script>

<style scoped lang="stylus">
</style>
