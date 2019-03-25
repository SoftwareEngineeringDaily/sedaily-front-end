<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription"
      >
        <header
          class="modal-header"
          id="modalTitle"
        >
          <slot name="header">
            This is the default tile!

          </slot>
          <button v-show='showCloseBtn'
          type="button"
          class="btn-close"
          @click="close"
          aria-label="Close modal"
          >
          x
        </button>
        </header>
        <section
          class="modal-body"
          id="modalDescription"
        >
          <slot name="body">
            I'm the default body!
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            I'm the default footer!
          </slot>
        </footer>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'modal',
    props: ['showCloseBtn'],
    methods: {
      close() {
        this.$emit('close');
      },
    },
  };
</script>
<style lang="stylus" scoped>
  @import './../css/variables'
  .modal-backdrop
    position fixed
    top 0
    bottom 0
    left 0
    right 0
    background-color rgba(0, 0, 0, 0.4)
    display flex
    justify-content center
    align-items center

  .modal
    background #FFFFFF
    box-shadow 2px 2px 20px 1px
    overflow-x auto
    display flex
    justify-content center
    max-width 600px
    width: 90%
    min-height 500px
    flex-direction column
    left 50%
    top 50%
    transform translate(-50%, -50%)

  .modal-header,
  .modal-search,
  .modal-footer
    padding 15px
    display flex
    align-items center
    justify-content center

  .modal-search
    border-bottom 1px solid #eeeeee
    color: primary-color
    justify-content center

  .modal-header
    border-bottom 1px solid #eeeeee
    color: primary-color
    justify-content space-between
    align-items center

  .modal-footer
    border-top 1px solid #eeeeee
    justify-content flex-end

  .modal-body
    position relative
    padding 20px 10px

  .btn-close
    border none
    font-size 40px
    padding-bottom 5px
    cursor pointer
    font-weight 900
    color primary-color
    background transparent
    outline none
</style>
