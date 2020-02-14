<script>
import SearchListView from '@/components/search/SearchListView'

export default {
  extends: SearchListView,

  data () {
    return {
      type: 'top',
      endPoint: 'fetchListData'
    }
  }
}
</script>
