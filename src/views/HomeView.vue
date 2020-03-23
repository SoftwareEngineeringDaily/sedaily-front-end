<script>
import HomeSection from '@/components/HomeSection'

export default {
  name: 'new-list',
  extends: HomeSection,
  data () {
    return {
      type: 'new',
      endPoint: 'fetchListData'
    }
  }
}
</script>
