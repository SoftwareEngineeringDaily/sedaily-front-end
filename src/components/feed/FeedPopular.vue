<template>
	<div class="popular-section" :class="[inverse ? 'inverse' : '']">
		<h5>{{sectionTitle}}</h5>
		<div class="popular-list">
			<div class="popular-item" v-for="(post, i) in posts" :key="i">
				<div class="left">
					<div class="number">
						{{i+1}}
					</div>
					<div class="copy">
						<h3 class="title">{{post.title}}</h3>
						<div class="details">
							<div class="date">{{post.date}}</div><span>|</span>
							<div class="duration">{{post.durationn}}</div>
						</div>
					</div>
				</div>
				<div class="img-container">
					<img :src="post.img"/>
				</div>
			</div>		
		</div>
	</div>
</template>

<script>

export default {
	name: "feed-popular",
	props: {
		posts: {
	      type: Array
	    },
	    sectionTitle: {
	    	type: String
	    },
	    inverse: {
	    	type: Boolean
	    }
	}
}
</script>

<style lang="stylus" scoped>
.popular-section
	position relative
	height 100%
	background-color #e9ecef
	padding 45px 30px
	&.inverse
		background-color #222
		color #fff
	h5
		text-align center
	.popular-item
		margin 20px 0
		display flex
		.img-container
			width 50px
			img 
				width 100%
		.left
			flex-basis 75%
			display flex

			.number 
				font-size 2rem
				font-weight bold
				color #868e96
				margin-right 10px
			.copy
				display flex
				flex-direction column
				.title
					font-size 1.3rem
				.details
					display flex
					> * 
						margin-right 5px


</style>









