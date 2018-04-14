<template>
  <div class="login-view container">
    <div>
     Company Name:
     <input type="text" />
   </div>
   <div>
     Description:
     <textarea> </textarea>
   </div>

    <div>
      People associated with this company:
     <input type="text" />
   </div>
  </div>
</template>

<script>
export default {
  name: 'UpdateCompanyProfile',
  components: {
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus">
.container
  margin-top 45px
</style>
