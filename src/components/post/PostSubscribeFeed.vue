<template>
	<div class="subscribe-section">
		<div>Subscribe:</div>
		<div><a href="https://itunes.apple.com/us/app/software-engineering-daily/id1253734426?mt=8"><b>Apple</b></a></div><span>|</span>
		<div><a href="https://play.google.com/store/apps/details?id=com.koalatea.sedaily"><b>Android</b></a></div><span>|</span>
		<div><a href="https://softwareengineeringdaily.com/feed/podcast/"><b>RSS</b></a></div>
	</div>
</template>


<script>
export default {
	props: {
		post: {
	      type: Object,
	      required: true
	    }
	}
}
</script>

<style lang="stylus" scoped>
.subscribe-section
	margin-top 15px
	text-transform uppercase
	font-size .8rem
	display flex
	a
		color #222 !important
	&.bold
		font-weight bold
	> *
		margin-right 15px
	
	
</style>