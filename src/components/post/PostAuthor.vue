<template>
	<div class="post-author">
		<div>Jeff Meyerson</div>
	</div>
</template>


<script>
export default {
	name: "post-author",
	props: {
		post: {
	      type: Object,
	      required: true
	    }
	}
}
</script>

<style lang="stylus" scoped>
.post-author
	display flex
	margin-top 10px
	
</style>