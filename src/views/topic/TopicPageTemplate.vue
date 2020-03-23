<template>
  <div class="topic-page">
    <div class="row">
      <div class="col-lg-8">
        <slot name="content"/>
      </div>
      <div class="col-lg-4">
        <slot name="side"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="stylus">
  .topic-page
    margin-top 5px

    .topicpage-header
      display flex
      align-items center
      justify-content space-between
      
      .header-title
        margin 15px 0
        font-weight 800
        font-size 2.7rem
        display flex
        align-items center

      .topic-logo-edit
        border 1px solid #e9ecef

    .content-block
      >>> img
        max-width 95%
        margin 20px auto
        display block

      
    
</style>
