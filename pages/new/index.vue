<script>
import BaseListView from '~/components/BaseListView.vue'

export default {
  extends: BaseListView,
  data () {
    return {
      type: 'new',
      endPoint: 'fetchListData'
    }
  }
}
</script>
