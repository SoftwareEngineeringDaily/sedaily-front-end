<template>
  <div>
  	<h4>Favourite</h4>
    <ul>
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