<template>
  <div class="popular-section" :class="[inverse ? 'inverse' : '']">
    <h5 class="section-title">{{sectionTitle}}</h5>
    <div class="popular-list">
      <div class="popular-item" v-for="(post, i) in displayedPosts" :key="i">
        <router-link :to="postPrettyUrl(post)">
        <div class="left">
          <div class="number">
            {{i+1}}
          </div>
          <div class="copy">
            <h3 class="title">{{ post.title.rendered | decodeString }}</h3>
            <div class="details">
              <post-meta :post="post" :isPreview="true" :showDuration="showDuration"/>
            </div>
          </div>
        </div>
        </router-link>
        <div v-if="showImg" class="img-container">
          <img :src="post.featuredImage"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { PostMeta } from '@/components/post'
import { postPrettyUrl } from '@/utils/post.utils'
import { mapActions } from "vuex"

export default {
  name: "feed-popular",
  components: { PostMeta },
  props: {
    postCount: {
        type: Number,
        default: 4
      },
      sectionTitle: {
        type: String
      },
      inverse: {
        type: Boolean
      },
      showImg: {
        type: Boolean,
        default: true
      },
      showDuration: {
        type: Boolean,
        default: false
      },
      postsType: {
        type: String,
        default: 'popular'
      }
  },
  data() {
      return {
        loading: false,
        displayedPosts: []
      }
  },
  mounted() {
      this.fetchPosts()
  },
  methods: {
    ...mapActions([ 'getPostsList']),
    postPrettyUrl (post) {
      return postPrettyUrl(post)
    },
    fetchPosts() {
      this.getPostsList({type:this.postsType}).then(
        data => {
          this.displayedPosts = data.posts.splice(0,this.postCount)
        }
      )
    }
  }

}
</script>

<style lang="stylus" scoped>
.popular-section
  position relative
  height 100%
  background-color #e9ecef
  padding 35px 30px
  a
    color #222
    text-decoration none
    &:hover
      .number
        color #a591ff !important
  &.inverse
    background-color #222
    color #fff
    a
      color #fff !important
  h5
    margin-top 0
    font-size 0.8rem
  .popular-item
    margin 20px 0
    display flex
    justify-content space-between
    .img-container
      width 80px
      margin-left 15px
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
          font-size 1.05rem
          font-weight 700
        .details
          font-size .65rem


</style>
