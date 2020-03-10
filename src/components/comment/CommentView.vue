<template>
  <span>
    <div v-if="editing" class="comment-holder">Editing Comment:
      <comment-edit
        :id="commentId"
        :originalContent="commentContent"
        :originalMentions="commentMentions"
        :doneCallback="doneEditingCallback" />
    </div>
    <div v-if="!editing && !wasDeleted" class="comment-holder">
      <div>
        <div class="profile-container">
          <profile-label :userData="user(comment)" :dateComment="date(comment)" />
        </div>
        <div v-if="comment && comment.highlight" class="quote-scroll">
          <blockquote class="quote">
            "{{comment.highlight}}"
          </blockquote>
        </div>
        <div v-if="!wasDeleted" class="content-area" v-html="compiledMarkdown" />
      </div>

      <div class="misc-detail">
        <div class="comment-op">
          <span v-if="!isReplying && isLoggedIn">
            <span class="link" @click="isReplying=!isReplying">Reply</span>
          </span>
          <span v-if="isReplying && isLoggedIn" class="link" @click="isReplying=!isReplying">Cancel</span>
          <span class="delete" v-if="this.isMyComment && !comment.deleted" @click="remove">Delete</span>
          <span
            class="delete"
            v-if="this.isMyComment && !comment.deleted"
            @click="editing=true">
            Edit
          </span>

          <span class="arrows voting-container">
            <voting-arrows
              v-if="this.$store.state.me.hasOwnProperty('_id')"
              class="upvote-comment"
              :upvoteHandler="upvoteHandler"
              :upvoted="comment.upvoted"
              :score="comment.score" />
          </span>
        </div>
      </div>

      <div v-if="isReplying">
        <comment-reply
          v-if="isLoggedIn"
          :entityId="comment.rootEntity"
          :doneCallback="doneReplyingCallback"
          :isReply="true"
          :parentCommentId="isParentComment ? comment._id : comment.parentComment"
          :rootEntityType="rootEntityType" />
      </div>
    </div>
  </span>
</template>

<script>
import marked from "marked";
import moment from "moment";
import { mapState, mapActions, mapGetters } from "vuex";
import VotingArrows from "@/components/VotingArrows";
import ProfileLabel from "@/components/profile/ProfileLabel";
import CommentReply from "@/components/comment/CommentReply";
import CommentEdit from "@/components/comment/CommentEdit";
import LastEditedInfo from "@/components/LastEditedInfo";

export default {
  name: "comment-view",
  components: {
    VotingArrows,
    ProfileLabel,
    CommentReply,
    LastEditedInfo,
    CommentEdit
  },
  props: {
    comment: {
      type: Object,
      required: true
    },
    isParentComment: {
      type: Boolean,
      default: false
    },
    rootEntityType: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      isReplying: false,
      editing: false
    };
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState({
      isRootLevelComment() {
        return !this.comment.parentComment;
      },

      compiledMarkdown() {
        marked.setOptions({
          breaks: true
        });
        const htmlMarkdown = marked(this.comment.content);
        const updatedHtmlMarkdown = this.updateLinkToOpenTab(htmlMarkdown);
        return this.linkifyMentions(updatedHtmlMarkdown);
      },

      placeholderAvatar(state) {
        return state.placeholderAvatar;
      },

      wasDeleted() {
        return this.comment.deleted;
      },

      lastEdited() {
        return this.comment.dateLastEdited;
      },

      me(state) {
        return state.me;
      },

      isMyComment(state) {
        if (this.comment.author !== null) {
          return this.me._id === this.comment.author._id;
        }
      }
    }),
    commentId() {
      return this.comment._id;
    },
    commentMentions() {
      if (!this.comment.mentions) return [];
      else return this.comment.mentions;
    },
    commentContent() {
      return this.comment.content;
    }
  },
  methods: {
    ...mapActions([
      'likeComment',
      'removeComment',
      'commentsFetch'
    ]),

    updateLinkToOpenTab(html) {
      const regExLink = /\<a href=/gi;
      const updatedLink = '<a target="_blank" href=';
      return html.replace(regExLink, updatedLink);
    },

    linkifyMentions(html) {
      const { mentions } = this.comment;
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
        const newText = `<a href="${this.getPublicProfileRoute(user)}" class="mention-link" target="_blank">@${user.name || 'anonymous'}</a>`
        newHtml = newHtml.replace(new RegExp(`@${user._id}|@${user.name}`,'g'), newText)
      }

      return newHtml
    },

    getPublicProfileRoute (user) {
      return `/profile/${user.name.toLowerCase().replace(/[ ]/g,'-')}-${user._id}`
    },

    doneReplyingCallback() {
      this.isReplying = false;
    },

    doneEditingCallback() {
      this.editing = false;
    },

    upvoteHandler() {
      this.likeComment({
        id: this.comment._id,
        parentCommentId: this.comment.parentComment,
        entityId: this.comment.rootEntity
      });
    },

    remove() {
      this.removeComment({
        id: this.comment._id
      })
        .then(() => {
          this.commentsFetch({
            entityId: this.comment.rootEntity
          });
        })
        .catch(error => {
          this.$toasted.error("Error deleting :(", {
              singleton: true,
              theme: "bubble",
              position: "bottom-center",
              duration : 700
          });
        });
    },

    user(comment) {
      if (comment.author) {
        return comment.author;
      } else {
        // Means we just made this comment
        return this.me;
      }
    },

    date(comment) {
      if (comment.dateCreated) {
        let date = moment(comment.dateCreated).format('MMMM Do, YYYY')
        let duration = moment(comment.dateCreated).startOf('second').fromNow()
        return `${date} | ${duration}`
      } else {
        return 'Now'
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../css/variables';

.content-area {
  /deep/ a {
    color: primary-color;
  }

  /deep/ .mention-link {
    color: #007bff;
    font-weight: 600;
  }

  /deep/ p {
    margin: 0;
  }
}

.profile-container
  display flex
  flex-direction column

.voting-container {
  margin-top: 20px;
}

.content-area {
  word-break: break-word
  color: #000
}

.replies .comment-holder:hover .misc-detail {
  visibility visible
}

.comment-holder .deleted {
  color: #bf687e;
}

.quote-scroll {
  margin: 1rem 0;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.quote {
  display: inline;
  font-size: 1.2rem;
  color: #fff;
  background-color: #a591ff;
}

.deleted {
  /deep/ p {
    padding-left 43px !important
  }
}

.misc-detail {
  color: #9B9B9B;
  font-size: 14px;
  font-family: 'Roboto', sans-serif;
}

.replies .misc-detail {
  visibility hidden
}

.link {
  padding: 0 !important;
  color: #9B9B9B;
  cursor: pointer;
  padding: 5px 8px;
}

.comment-date {
  padding-left: 10px;
}

.comment-op {
  margin-bottom 10px
}

.delete {
  padding-left: 10px;

  &:hover {
    color: #8E0505;
    cursor: pointer;
  }
}

.upvote-comment {
  padding-left 10px
}

.bullet-point {
  display: inline-flex;
  font-size: 0.65em;
  min-height: 20px;
  margin-left: 5px;
  margin-right: 5px;
}

@media (max-width: 600px) {
  .comment-holder .deleted {
    font-size: 12px;
    max-width: 265px;
  }
}
</style>
