<script>
import Tribute from 'tributejs'

export default {
  name: 'vue-tribute',
  props: {
    options: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tribute: null
    }
  },
  mounted() {
    const $el = this.$slots.default[0].elm

    this.tribute = new Tribute(this.options)
    this.tribute.attach($el)

    $el.addEventListener('tribute-replaced', e => {
      this.$emit('tribute-replaced', e)
    })

    $el.addEventListener('tribute-no-match', e => {
      this.$emit('tribute-no-match', this.tribute.current.mentionText)
    })
  },
  render(h) {
    return h(
      'div',
      {
        staticClass: 'v-tribute'
      },
      this.$slots.default
    )
  }
}
</script>

<style>
.tribute-container ul {
    max-height: 240px;
    overflow: auto;
    padding: 0;
    margin: 10px;
    border: 1px solid #c5c5c5;
}
.tribute-container li {
    background: white;
    padding: 10px;
    list-style: none;  
    box-shadow: 0 3px 10px rgb(238, 238, 238), 0 3px 10px rgb(238, 238, 238);
}
.tribute-container li:not(:last-child) {
    border-bottom: 1px solid #c5c5c5;
}
ul.tribute-container {
    border-radius: 5px;
}
.tribute-container li.highlight {
    background: #a591ff;
}

.tribute-container li:hover {
    background: #a591ff;
    cursor: pointer;
}

.tribute-container li.no-match {
    display: none;
}
.tribute-container img {
    border-radius: 3px;
    width: 26px;
    background: #fff;
    margin-right: 5px;
}
</style>
