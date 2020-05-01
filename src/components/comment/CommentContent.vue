<template>
  <div v-if="comment">
    <div class="profile-container">
      <profile-label
        :userData="user"
        :dateComment="commentDateFormat(comment)" />

      <social-sharing
        v-show="comment.highlight"
        :url="shareUrl"
        :href="shareUrl"
        :title="shareText"
        twitter-user="software_daily"
        inline-template>
        <div class="cursor-pointer hover-highlight">
          <network network="twitter">
            <i class="fa fa-2x fa-twitter" />
          </network>
        </div>
      </social-sharing>

    </div>
    <comment-quote :highlight="comment.highlight" />
    <div v-html="compiledMarkdown" class="content-area" />
  </div>
</template>

<script>
import moment from 'moment'
import marked from 'marked'
import SocialSharing from 'vue-social-sharing'
import ProfileLabel from '@/components/profile/ProfileLabel'
import CommentQuote from '@/components/comment/CommentQuote'

export default {
  props: {
    comment: {
      type: Object,
    },
  },

  components: {
    ProfileLabel,
    SocialSharing,
    CommentQuote,
  },

  computed: {
    user () {
      return this.comment.author || this.$store.state.me
    },

    shareUrl () {
      return window.location.href
    },

    shareText () {
      return `${this.user.name} left a highlight, "${this.comment.highlight}"`
    },

    compiledMarkdown () {
      marked.setOptions({
        breaks: true
      })

      const htmlMarkdown = marked(this.comment.content)
      const updatedHtmlMarkdown = this.updateLinkToOpenTab(htmlMarkdown)

      return this.linkifyMentions(updatedHtmlMarkdown)
    },
  },

  methods: {
    commentDateFormat (dateCreated) {
      if (dateCreated) {
        const date = moment(dateCreated).format('MMMM Do, YYYY')
        const duration = moment(dateCreated).startOf('second').fromNow()

        return `${date} | ${duration}`
      }

      return 'Now'
    },

    getPublicProfileRoute (user) {
      return `/profile/${user._id}`
    },

    linkifyMentions(html) {
      const { mentions } = this.comment

      if (!mentions) {
        return html
      }

      // We sort mentions by longest name first so that we don't have partial
      // matches from shorter mentions that would mess up the mention links.
      const sortedMentions = mentions.slice(0).sort((a, b) => {
        return a.name.length >= b.name.length
      })

      let newHtml = html

      for (var i = 0; i < sortedMentions.length; i++) {
        const user = sortedMentions[i]
        const newText = `<a href="${this.getPublicProfileRoute(user)}" style="font-weight:700;" target="_blank">@${user.name || 'anonymous'}</a>`
        newHtml = newHtml.replace(new RegExp(`@${user._id}|@${user.name}`,'g'), newText)
      }

      return newHtml
    },

    updateLinkToOpenTab(html) {
      const regExLink = /\<a href=/gi;
      const updatedLink = '<a target="_blank" href=';
      return html.replace(regExLink, updatedLink);
    },
  }
}
</script>

<style lang="stylus" scoped>
.profile-container
  display flex
  align-items center

  *:first-child
    flex-grow 1

.cursor-pointer
  cursor pointer

.hover-highlight:hover,
.hover-highlight.active
  color #a591ff

>>> .quote-scroll
  margin 1rem 0
  padding 0.8rem
  border 1px solid #ccc
  border-radius 4px

</style>
