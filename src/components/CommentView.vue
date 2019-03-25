<template>
  <span>
    <div v-if="editing" class="comment-holder">Editing Comment:
      <comment-edit
        :id="commentId"
        :originalContent="commentContent"
        :originalMentions="commentMentions"
        :doneCallback="doneEditingCallback"
      ></comment-edit>
    </div>
    <div v-if="!editing" class="comment-holder">
      <div>
        <div class="profile-container">
          <profile-label :userData="user(comment)" :dateComment="date(comment)"></profile-label>
          <!-- <span class="comment-date">{{}}</span>      -->
        </div>
        <span v-if="wasDeleted" class="col-md-8 content-area deleted" v-html="compiledMarkdown"></span>
        <div v-if="!wasDeleted" class="content-area" v-html="compiledMarkdown"></div>
      </div>

      <last-edited-info v-if="!wasDeleted" :lastEditedTimestamp="lastEdited"/>

      <div class="row misc-detail">
        <div class>
          <!-- <div class="bullet-point"></div> -->
          <!-- <div v-if="isLoggedIn" class="bullet-point"></div> -->
          <span v-if="!isReplying && isLoggedIn">
            <span class="link" @click="isReplying=!isReplying">Reply</span>
          </span>
          <span v-if="isReplying && isLoggedIn" class="link" @click="isReplying=!isReplying">Cancel</span>

          <span class="delete" v-if="this.isMyComment && !comment.deleted" @click="remove">Delete</span>
          <span
            class="delete"
            v-if="this.isMyComment && !comment.deleted"
            @click="editing=true"
          >Edit</span>

          <span class="arrows voting-container">
            <voting-arrows
              class="upvote-comment"
              :upvoteHandler="upvoteHandler"
              :upvoted="comment.upvoted"
              :score="comment.score"
            ></voting-arrows>
          </span>
        </div>
      </div>

      <div class="row" v-if="isParentComment && isReplying">
        <comment-reply
          v-if="isLoggedIn"
          :entityId="comment.rootEntity"
          :doneCallback="doneReplyingCallback"
          :isReply="true"
          :parentCommentId="comment._id"
          :rootEntityType="rootEntityType"
        ></comment-reply>
      </div>
      <div v-if="!isParentComment && isReplying" class="row">
        <comment-reply
          v-if="isLoggedIn"
          :replyingTo="comment.author"
          :entityId="comment.rootEntity"
          :doneCallback="doneReplyingCallback"
          :isReply="true"
          :parentCommentId="comment.parentComment"
          :rootEntityType="rootEntityType"
        ></comment-reply>
      </div>
    </div>
  </span>
</template>

<script>
import marked from "marked";
import moment from "moment";
import { mapState, mapActions, mapGetters } from "vuex";
import VotingArrows from "components/VotingArrows.vue";
import ProfileLabel from "components/ProfileLabel.vue";
import CommentReply from "components/CommentReply.vue";
import CommentEdit from "@/components/CommentEdit.vue";
import LastEditedInfo from "@/components/LastEditedInfo.vue";

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
    ...mapActions(["likeComment", "removeComment", "commentsFetch"]),
    updateLinkToOpenTab(html) {
      const regExLink = /\<a href=/gi;
      const updatedLink = '<a target="_blank" href=';
      return html.replace(regExLink, updatedLink);
    },
    linkifyMentions(html) {
      const { mentions } = this.comment;
      if (!mentions) return html;
      // We sort mentions by longest name first so that we don't have partial
      // matches from shorter mentions that would mess up the mention links.
      const sortedMentions = mentions.slice(0).sort((a, b) => {
        return a.name.length >= b.name.length;
      });

      let newHtml = html;
      for (var ii = 0; ii < sortedMentions.length; ii++) {
        const user = sortedMentions[ii];
        const textToReplace = "@" + user.name;
        const newText = `<a href='/profile/${user._id}' target='_blank'>
        ${textToReplace}</a>`;
        newHtml = newHtml.split(textToReplace).join(newText);
      }
      return newHtml;
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
          this.$toasted.error("Error deleting :(");
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
        return moment(comment.dateCreated)
          .startOf("second")
          .fromNow();
      } else {
        return "Now";
      }
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../css/variables';

.content-area {
  /deep/ a {
    color: primary-color;
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

.comment-holder {
  margin-bottom: -30px;
}

.content-area {
  margin-top: 1%;
  padding-left: 9%;
  word-break: break-word;
  color: #000;
}

.comment-holder .deleted {
  color: #bf687e;
  background: #f7f7f7;
  padding-top: 16px;
  border-radius: 20px;
  padding-left: 20px;
  max-width: 280px;
}

.deleted {
  /deep/ p {
    padding-left 43px !important
  }
}

.misc-detail {
  color: #9B9B9B;
  font-size: 14px;
  margin-left: 45px;
  font-family: 'Roboto', sans-serif;

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
