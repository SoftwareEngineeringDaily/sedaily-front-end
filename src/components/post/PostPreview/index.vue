<template>
	<router-link :to="postPrettyUrl">
		<div class="news-post" :class="[inverse ? 'inverse' : '']">
			<div class="img-container" v-if="showImg">
				<img :src="post.featuredImage"/>
			</div>
			<div class="body-container">
				<post-preview-copy
					:post="post"
					:isPreview="isPreview"
					:inverse="inverse"
					:showGuest="showGuest"
					:showTags="showTags"
					:showCopy="showCopy" />
			</div>
		</div>
	</router-link>
</template>

<script>
import PostPreviewCopy from './PostPreviewCopy'
import { postPrettyUrl } from '@/utils/post.utils'

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
	    isPreview: {
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
	    showGuest: {
	    	type: Boolean,
	    	default: true
	    },
	    showCopy: {
	    	type: Boolean,
	    	default: true
	    }
	},
	computed: {
		postPrettyUrl () {
      console.log('this.post ', this.post)
      return postPrettyUrl(this.post)
    }
	}
}
</script>

<style lang="stylus" scoped>
a
	text-decoration none !important
	cursor pointer
.news-post
	display flex
	position relative
	flex-direction column
	height 100%
	background #e9ecef
	&.inverse
		background #222
	.img-container
		height 200px
		background #fff
		overflow hidden
		img
			width 100%
			height 100%
			object-fit cover
			transition all .2s
	&:hover
		img
			transform: scale(1.05)



</style>
