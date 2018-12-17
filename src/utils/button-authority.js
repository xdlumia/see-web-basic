export default {
  computed: {
    authorityButtons() {
      let authorityBtn = this.$local.fetch('authorityBtn')

      return Object.values(authorityBtn).reduce((arr, current) => {
        arr.push.apply(arr, current)

        return arr
      }, [])
    }
  }
}
