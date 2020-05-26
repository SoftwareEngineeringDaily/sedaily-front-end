<template>
  <transition name="modal-fade">
    <div class="modal-backdrop">
      <div class="modal"
        role="dialog"
        aria-labelledby="modalTitle"
        aria-describedby="modalDescription">
        <header
          class="modal-header"
          id="modalTitle">
          <slot name="header"/>
          <button
            v-show="showCloseBtn"
            type="button"
            class="btn-close"
            @click="close"
            aria-label="Close modal">
            <i class="fa fa-close" />
          </button>
        </header>

        <section
          class="modal-body"
          id="modalDescription">
          <slot name="body"/>
        </section>

        <footer class="modal-footer">
          <slot name="footer"/>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'modal',
    props: [
      'showCloseBtn',
    ],
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
    opacity 1

  .modal
    background #FFFFFF
    overflow-x auto
    display flex
    justify-content center
    max-width 600px
    width: 90%
    min-height 0
    height auto
    flex-direction column
    top 50%
    left 50%
    border-radius 4px
    box-shadow 0 2px 32px 1px rgba(0,0,0, 0.35)
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

    >>> *
      margin-bottom 0

  .modal-footer
    border-top 1px solid #eeeeee
    justify-content flex-end

  .modal-body
    position relative
    padding 20px 10px

  .btn-close
    border none
    font-size 1rem
    cursor pointer
    font-weight 900
    color primary-color
    background transparent
    outline none

</style>
