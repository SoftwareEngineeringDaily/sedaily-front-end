<template>
	<div class="post-item">
		<div class="img-container" v-if="showImg">
			<img :src="post.featuredImage"/>
		</div>
		<div class="body-container" :class="[inverse ? 'inverse' : '']">
			<post-preview-copy 
				:post="post" 
				:inverse="inverse" 
				:showTags="showTags"
				:showCopy="showCopy" />
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
	    },
	    showImg: {
	    	type: Boolean,
	    	default: true
	    },
	    showTags: {
	    	type: Boolean,
	    	default: true
	    },
	    showCopy: {
	    	type: Boolean,
	    	default: true
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
		height 350px
		overflow hidden
		img 	
			width 100%
			height 100%
			object-fit cover
	.body-container
		height 380px
		background #e9ecef
		&.inverse 
			background #222
</style>