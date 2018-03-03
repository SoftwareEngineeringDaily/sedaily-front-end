<script>
import BaseListView from '~/components/BaseListView.vue'

export default {
  extends: BaseListView,
  data () {
    return {
      type: 'top',
      endPoint: 'fetchListData'
    }
  }
}
</script>
