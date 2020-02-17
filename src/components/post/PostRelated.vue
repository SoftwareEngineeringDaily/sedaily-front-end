<template>
  <div class="related-container" v-if="post">
    <h6 class="section-title">Related Episodes</h6>
    <div class="recommended-grid">
      <post-preview
        v-for="post in posts"
        :key="post._id"
        :post="post"
        :isPreview="true"
        :showCopy="false"
        :showGuest="false"
        :showImg="false"
        :showTags="false"/>
    </div>
  </div>
</template>

<script>
import PostPreview from './PostPreview'
import { mapActions } from 'vuex'
export default {
  components: {
    PostPreview,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  computed: {
    posts: {
      get: function () {
        const post = this.post
        const store_posts = this.$store.state.posts
        const posts = Object.keys(store_posts)
          .map(post => store_posts[post])
          .filter(p => (p.link && p.link.search(/software(engineering|)daily\.com/g) >= 0))

        posts.sort((a, b) => (0.5 - Math.random()))

        return posts.splice(0, 2)
      },
    },
  },
  methods: {
    ...mapActions([ "getTopicsInSearch" ]),
  },
  mounted() {
    const store_posts = Object.keys(this.$store.state.posts)

    if (store_posts.length) {
      return
    }

    this.getTopicsInSearch({}).then(
      data => {
        this.$store.commit('setPosts', {
          posts: data.posts
        })
      }
    );
  }
}
</script>
