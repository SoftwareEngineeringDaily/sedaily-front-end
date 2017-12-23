<template>
  <v-card class="my-2">
    <v-card-media :src="image" height="200px" />
    
    <v-card-title>
      <a :href="feedItem.url | externalUrl" target="_blank"
      rel="external nofollow">
        <span class='title'>
        {{feedItem.title || feedItem.url}}
        </span>
      </a>
      <div class="mt-1">{{feedItem.description}}</div>
    </v-card-title>     
    <v-card-actions>
      <p class="ml-2">
        Votes:{{feedItem.score}}
      </p>
    </v-card-actions>
  </v-card>    
</template>

<script>
export default {
  name: 'FeedItem',
  props: {
    feedItem: {
      type: Object,
      required: true
    }
  },
  computed: {
    image () {
      return this.feedItem.image !== undefined
        ? this.feedItem.image
        : 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/linkplaceholder.png'
    }
  }
}
</script>
