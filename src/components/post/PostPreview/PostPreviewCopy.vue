<template>
	<div class="body" :class="[inverse ? 'inverse' : '']">
		<post-topics-list :post="post" :inverse="inverse" v-if="showTags"/>
		<h3 class="title">
			<router-link :to="postPrettyUrl">{{ post.title.rendered | decodeString }}</router-link>
		</h3>
		 
		<div class="copy" v-if="showCopy">
			<span v-if="post.excerpt.rendered !== '' && metaDescription === ''" v-html="post.excerpt.rendered"></span>
        	<p v-else>{{metaDescription}}</p>
		</div>
		<post-meta :post="post" :showDuration="false"/>
		<div class="author">
			Posted by Jeff Myerson
		</div>
	</div>
</template>


<script>
import { PostMeta, PostTopicsList, PostTopics, PostTitle, PostAuthor } from '@/components/post'
import { postPrettyUrl } from '@/utils/post.utils'
export default {
	components: { PostMeta, PostTopicsList, PostTopics, PostTitle, PostAuthor },
	props: {
		post: {
	      type: Object,
	      required: true
	    },
	    inverse: {
	    	type: Boolean
	    },
	    showTags: {
	    	type: Boolean
	    },
	    showCopy: {
	    	type: Boolean,
	    	default: true
	    }
	},
	computed: {
		postPrettyUrl () {
			console.log(this.post)
	      return postPrettyUrl(this.post)
	    },
	    metaDescription () {
	    	console.log('this.post',this.post)
	      const maxLength = 200;
	      const el = document.createElement('template')
	      el.innerHTML = this.post.content.rendered.trim()
	      // spans contain text to extract "summary"
	      let paras = el.content.querySelectorAll('span')
	      if ( paras.length === 0){
	        paras = el.content.querySelectorAll('p')
	      }

	      let description = '';
	      for (let para of paras) {

	        if(para.className !== 'powerpress_links powerpress_links_mp3'){
	          description += para.innerText + ' ';
	        }
	        if (description.length >= maxLength) {
	          break;
	        }
	      }
	      if (description.length > maxLength) {
	        return description.substr(0, maxLength-3) + '...'
	      }
	      return description;
	    },
	}
}
</script>

<style lang="stylus" scoped>
.body
	padding 1.3rem 1.5rem
	@media (max-width 599px)	
		padding: 2rem .8rem;
	.post-details
		display flex
		font-weight bold
		> *
			margin-right 15px
	.title a
		text-decoration none
		font-size 1.7rem
		font-weight 700
		&:hover
			color inherit
	.tags 
		margin 10px 0
		
	&.inverse
		color #fff
		.tags
			span
				background-color #fff !important
				color #222 !important
		.title a
			color #fff
	.author 
		margin-top 10px
</style>