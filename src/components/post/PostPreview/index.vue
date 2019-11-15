<template>
	<div class="post-item">
		<div class="img-container">
			<img :src="post.img"/>
		</div>
		<div class="body-container" :class="[inverse ? 'inverse' : '']">
			<post-preview-copy :post="post" :inverse="inverse" />
		</div>
	</div>
</template>


<script>
import PostPreviewCopy from './PostPreviewCopy'

export default {
	name: "post-preview",
	components: { PostPreviewCopy },
	props: {
		post: {
	      type: Object
	    },
	    inverse: {
	    	type: Boolean
	    }
	}
}
</script>

<style lang="stylus" scoped>
.post-item
	display flex
	position relative
	flex-direction column
	.img-container
		position relative
		img 
			width 100%
	.body-container
		height 300px
		&.inverse 
			background #222
</style>