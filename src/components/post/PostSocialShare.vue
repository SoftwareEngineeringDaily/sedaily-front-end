<template>
	<social-sharing
	    :url="post.url"
	    :title="post.title.rendered"
	    :description="postContent"
	    twitter-user="software_daily"
	    inline-template>
		<div class="sharing">
	      <network network="facebook" style="height:30px;width: 30px;;align-items:center;justify-content:center;display:flex;background-color: #222;border-radius: 2px;margin-bottom: 10px">
	        <i class="fa fa-facebook" />
	      </network>
	      <network network="linkedin" style="height:30px;width: 30px;;align-items:center;justify-content:center;display:flex;background-color: #222;border-radius: 2px;margin-bottom: 10px">
	        <i class="fa fa-linkedin" />
	      </network>
	      <network network="twitter" style="height:30px;width: 30px;;align-items:center;justify-content:center;display:flex;background-color: #222;border-radius: 2px;margin-bottom: 10px">
	        <i class="fa fa-twitter" />
	      </network>
	       <network network="telegram" style="height:30px;width: 30px;;align-items:center;justify-content:center;display:flex;background-color: #222;border-radius: 2px;margin-bottom: 10px">
	        <i class="fa fa-telegram" />
	      </network>
	    </div>
	</social-sharing>
</template>


<script>
import SocialSharing from 'vue-social-sharing'

export default {
	name: "post-social-share",
	components: { SocialSharing },
	props: {
		post: {
	      type: Object,
	      required: true
	    },
	    postContent: {
	    	type: String
	    }
	}
}
</script>

<style lang="stylus" scoped>
.sharing 
	display flex
	font-size 1.1rem
	color #fff
	flex-direction column
	align-items center
	@media (min-width 800px)
		position sticky
		top 100px
		margin-top 600px

	
</style>







