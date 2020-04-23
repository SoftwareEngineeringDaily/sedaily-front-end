<template>
  <div v-if="typeof topics === 'array'" class="topics-container">
    <ul>
      <li class="topic-item">
        <router-link to="/popular">Most Popular</router-link>
      </li>
      <li
        class="topic-item"
        v-for="topic in topics"
        :key="topic._id"
        @click="topicHandler(topic)"
        :class="getClassForTopic(topic._id)">
        {{topic.name}}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    topics: {
      type: Array
    },
    fetchPosts: {
      type: Function
    },
    topicHandler: {
      type: Function
    },
    getClassForTopic: {
      type: Function
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
