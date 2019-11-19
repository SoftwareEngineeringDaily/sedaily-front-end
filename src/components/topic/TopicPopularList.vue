<template>
  <div class="topics-container">
  	<h4>Most Popular</h4>
    <ul>
      <li @click="fetchPosts" :class="getClassForTopic('')">All</li>
      <li
        class="topic-item"
        v-for="topic in topics"
        :key="topic._id"
        @click="topicHandler(topic)"
        :class="getClassForTopic(topic._id)"
      >{{ topic.name }}</li>
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