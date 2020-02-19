<template>
  <social-sharing
    v-if="post.title"
    :url="post.url"
    :href="post.url"
    :title="post.title.rendered"
    :description="postContent"
    twitter-user="software_daily"
    inline-template>
    <div class="sharing">
      <network network="facebook">
        <i class="fa fa-facebook" />
      </network>
      <network network="linkedin">
        <i class="fa fa-linkedin" />
      </network>
      <network network="twitter">
        <i class="fa fa-twitter" />
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
    },
  }
}
</script>

<style lang="stylus">
.sharing
  text-align center
  font-size 1.1rem
  color #fff
  span
    cursor pointer
    display inline-block
    height 30px
    width 30px
    margin-right 10px
    line-height 30px
    background-color #c4c4c4
    border-radius 2px
    &:hover
      background-color #a591ff
      transform scale(1.05)

</style>
