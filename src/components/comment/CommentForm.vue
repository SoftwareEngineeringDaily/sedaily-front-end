
<template>
  <div v-if="me" class="comment-container">
    <!-- <span class="active-without-border" v-if="isLoggedIn">
      <router-link class="profile-img-link" to="/profile">
        <img class="profile-img" :src="errorImg || avatarUrl" @error="imgOnError">
      </router-link>
    </span> -->
    <vue-tribute
      class="comment-box__container"
      :options="options"
      @tribute-replaced="tributeReplaced"
      @tribute-no-match="tributeNoMatch"
    >
      <textarea
        placeholder="Your comment ..."
        class="comment-box"
        ref="contentTextarea"
        :disabled="isSubmitting"
        type="text"
        v-model="commentContent"
      />
    </vue-tribute>

    <div v-if="isLoggedIn" style="align-self: flex-end;">
      <div v-if="isSubmitting">
        <spinner :show="true"></spinner>
      </div>
      <div class="buttons-comment" v-else>
        <button
          class="button-submit"
          :disabled="isSubmitting"
          @click="submitComment"
        >{{submitButtonText}}</button>

        <button v-if="showCancel" class='btn-cancel btn btn-link'
        :disabled="isSubmitting"
        @click='cancelPressed'><i class="fa fa-times"/></button>
      </div>
    </div>
    <div v-else>
      <button @click='errorSubmit' class="button-submit">{{submitButtonText}}</button>
    </div>
  </div>
</template>

<script>
import VueTribute from "@/components/VueTribute.js";
import ProfileLabel from "@/components/profile/ProfileLabel";
import { debounce, each, map } from "lodash";
import Spinner from "@/components/Spinner";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "comment-form",
  props: {
    userData: {
      type: Object,
      default: function() {
        return {
          avatarUrl: ""
        };
      }
    },
    initialComment: {
      type: String
    },
    showCancel: {
      type: Boolean,
      default: false
    },
    cancelPressed: {
      type: Function
    },
    isSubmitting: {
      type: Boolean,
      required: true
    },
    submitCallback: {
      type: Function,
      required: true
    },
    existingMentions: {
      type: Array,
      default: () => {
        return [];
      }
    },
    submitButtonText: {
      type: String,
      default: "Submit"
    }
  },
  components: {
    VueTribute,
    ProfileLabel,
    Spinner
  },
  data() {
    return {
      // Options for auto-complete mentions
      options: {
        menuItemTemplate: function(item) {
          const img = item.original.user.avatarUrl
            ? item.original.user.avatarUrl
            : "https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png";
          return `<span><img width="30px" src='${img}'/> ${
            item.original.value
          } </span>`;
        },
        noMatchTemplate: "",
        allowSpaces: true,
        values: []
      },
      mentionedUsers: this.existingMentions,
      commentContent: this.initialComment,
      errorImg: ''
    };
  },
  mounted() {
    // this.$refs.content.focus()
  },
  watch: {
    commentContent: function() {
      // Check mentions
      if(this.isLoggedIn){
        const currentMentions = [];
        each(this.mentionedUsers, user => {
          const mentionText = "@" + user.name;
          if (this.commentContent.indexOf(mentionText) >= 0) {
            currentMentions.push(user);
          }
        });
        this.mentionedUsers = currentMentions;
      } else {
        this.$toasted.error('You must login to post a comment')
      }
    },
    initialComment: function() {
      this.commentContent = this.initialComment;
    }
  },

  computed: {
    // local computed methods +
    ...mapGetters(["isLoggedIn"]),
    ...mapState({
      me(state) {
        return state.me;
      },
      alreadySubscribed(state) {
        if (!this.isLoggedIn) return false;
        if (state.me && state.me.subscription && state.me.subscription.active) {
          return true;
        } else {
          return false;
        }
      },
      avatarUrl(state) {
        return this.me.avatarUrl || state.placeholderAvatar;
      }
    }),
    hasMentions() {
      return this.mentionedUsers.length > 0;
    }
  },
  methods: {
    ...mapActions(["searchUsers"]),
    errorSubmit() {
      this.$toasted.error('You must login to post a comment')
    },
    handleSelectUser(user) {
      // Check if contains user already to avoid duplicates.
      let containsUserAlready = false;
      each(this.mentionedUsers, function(existingUser) {
        if (existingUser._id.toString() === user._id.toString()) {
          containsUserAlready = true;
        }
      });
      if (!containsUserAlready) {
        this.mentionedUsers.push(user);
      }
    },
    imgOnError() {
      this.errorImg = 'https://s3-us-west-2.amazonaws.com/sd-profile-pictures/profile-icon-9.png'
    },
    tributeReplaced({ detail }) {
      const { user } = detail.item.original;

      // todo: TRY: catch
      // V-model gets out of sync when new element is inserted so updating it:
      this.commentContent = this.$refs.contentTextarea.value;
      this.handleSelectUser(user);
    },
    tributeNoMatch: debounce(function(searchQuery) {
      this.searchUsers({ name: searchQuery }).then(users => {
        this.setUserList(users);
      });
    }, 10),

    // Remove dupes for now since we have a weird hack:
    alreadyContainsMention(user) {
      let contains = false;
      each(this.options.values, mention => {
        if (user._id == mention.user._id) {
          contains = true;
        }
      });
      return contains;
    },
    // TODO: loop over and match. Start with longer matches
    // Search for [space]@_${value} so when we replace while we replace
    // with . What if mention is first character.
    setUserList(userList) {
      this.options.values.splice(0, 10);
      userList.forEach(user => {
        if (!this.alreadyContainsMention(user)) {
          this.options.values.push({ key: user.name, value: user.name, user });
        }
      });
    },

    submitComment() {
      const mentions = map(this.mentionedUsers, user => {
        return user._id;
      });
      this.mentionedUsers = []; // resetting mentioned users
      this.submitCallback({
        content: this.commentContent,
        mentions: mentions
      });
    }
  }
};
</script>

<style scoped lang="stylus">
@import '../../css/variables'
.btn-cancel
  padding 0 0 0 10px
.button-submit
  outline none
  border-radius 4px
  margin-top 10px
  a
    color white
    &:hover
      text-decoration none
.buttons-comment
  display flex
.comment-container
  background none
  display flex
  flex-direction column
  align-items center
  width: 100%;
  .profile-img
    width 35px
    height 35px
    border-radius 50px
    margin-right 10px
.comment-box
  margin 0 10px
  margin-left 0
  margin-right 0
  width 100%
  padding 5px
  padding-left 10px
  border-radius 4px
  border-color #c5c5c5
  resize none
  height inherit
  outline none
  border: 1px solid #ccc
  height 100px

.comment-box__container
  display flex
  width 100%
  &:hover
    text-decoration none

.buttons-comment 
  display: flex;

.comment-container 
  display: flex;
  align-items: center;
  width: 100%;

  .profile-img 
    width: 35px;
    height: 35px;
    border-radius: 50px;
  
.comment-box__container
  display: flex;
  width: 100%;

</style>
