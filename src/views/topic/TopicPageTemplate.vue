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
    
    .topicpage-header
    
      .header-title
        margin 15px 0
        font-weight 800
        font-size 2.7rem
</style>
