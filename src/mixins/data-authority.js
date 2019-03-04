/** 用户数据权限校验方法
 * @author web-闫超
 * @date 2018年7月26日
 *
 **/

export default {
  methods: {
    checkColumnDataPermission(code, fieldName) {
      let dataAuthList = this.$local.fetch('dataAuthList') || []

      for(let dataAuth of dataAuthList) {
        if (dataAuth.code === code) {
          for(let setting of dataAuth.colSetting || []) {
            if (setting.fieldCode === fieldName && setting.type === 1) {
              return true
            }
          }
        }
      }

      return false
    }
  }
}
