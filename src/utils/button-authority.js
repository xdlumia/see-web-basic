export default {
  computed: {
    authorityButtons() {
      let authorityBtn = this.$local.fetch('navData')

      let generateButtonCodes = (authorityBtn, arr) => {
        return authorityBtn.reduce((arr, current) => {
          arr.push.apply(arr, current.buttonsCode)

          current.code && (arr.push( current.code))

          if (current.children) {
            generateButtonCodes(current.children, arr)
          }
          return arr
        }, arr || [])
      }

      return generateButtonCodes(authorityBtn)
    }
  },
  methods:{
    /**
     * 获取权限下数量限制
     * @param {String} sourceCode 
     */
    getSourceMaxNum(sourceCode){
      let maxNum;
      let sourceMaxNumData = this.$local.fetch('sourceMaxNumData') || []
      sourceMaxNumData.some(item=>{
        if(item.sourceCode==sourceCode){
          maxNum=item.maxNum;
          return true;
        }
      })
      return maxNum;
    }
  }
}
