<template>
  <div class="categories-container">
    <div v-if="showUserTopics" class="topics-container">
      <h4>Favourite</h4>
      <ul>
        <li
          class="topic-item"
          v-for="topic in showTopics"
          :key="topic._id"
          @click="topicHandler(topic)"
          :class="getClassForTopic(topic._id)"
        >{{ topic.name }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    showTopics: {
      type: Array
    },
    topicHandler: {
      type: Function
    },
    getClassForTopic: {
      type: Function
    },
    showUserTopics: {
      type: Boolean
    }
  }
}
</script>
