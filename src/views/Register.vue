<template>
  <div class="login-view container">
    <div class='row'>
      <form class='col-md-6 offset-md-3' v-on:submit.prevent='login'>
        <h1>Register</h1>

        <div class="form-group">
          <label for="exampleInputEmail1">Email address</label>
          <input type="email" v-model='email' class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
          <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
        </div>

        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input type="password" v-model='password' class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>

        <button class='btn btn-primary' @click.prevent='login' :disabled='loading'>Register</button>
      </form>
    </div>

    <spinner :show="loading"></spinner>
  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'

export default {
  name: 'top-list',

  components: {
    Spinner
  },

  data () {
    return {
      email: '',
      password: '',
      loading: false
    }
  },

  methods: {
    login: function () {
      this.loading = true
      this.$store.dispatch('register', {
        email: this.email,
        password: this.password
      })
      .then((response) => {
        this.loading = false
        if (response.data.token) this.$router.replace('/')
      })
    }
  }
}
</script>

<style lang="stylus">

.news-list-nav, .news-list
  background-color #fff
  border-radius 2px

.news-list-nav
  padding 15px 30px
  position fixed
  text-align center
  top 55px
  left 0
  right 0
  z-index 998
  box-shadow 0 1px 2px rgba(0,0,0,.1)
  a
    margin 0 1em
  .disabled
    color #ccc

.news-list
  position absolute
  margin 30px 0
  width 100%
  transition all .5s cubic-bezier(.55,0,.1,1)
  ul
    list-style-type none
    padding 0
    margin 0

.slide-left-enter, .slide-right-leave-active
  opacity 0
  transform translate(30px, 0)

.slide-left-leave-active, .slide-right-enter
  opacity 0
  transform translate(-30px, 0)

.item-move, .item-enter-active, .item-leave-active
  transition all .5s cubic-bezier(.55,0,.1,1)

.item-enter
  opacity 0
  transform translate(30px, 0)

.item-leave-active
  position absolute
  opacity 0
  transform translate(30px, 0)

@media (max-width 600px)
  .news-list
    margin 10px 0
</style>
