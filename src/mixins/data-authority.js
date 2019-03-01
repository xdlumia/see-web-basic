/** 用户数据权限校验方法
 * @author web-闫超
 * @date 2018年7月26日
 *
 **/

function checkDataPermission(code, fieldName, type) {
  let dataAuthList = this.$local.fetch('dataAuthList') || []

  for(let dataAuth of dataAuthList) {
    if (dataAuth.code === code) {
      for(let setting of dataAuth[type] || []) {
        if (setting.fieldCode === fieldName) {
          return true
        }
      }
    }
  }

  return false
}

export default {
  methods: {
    checkColumnDataPermission(code, fieldName) {
      return checkDataPermission.call(this, code, fieldName, 'colSetting')
    },
    checkRowDataPermission(code, fieldName) {
      return checkDataPermission.call(this, code, fieldName, 'rowSettingList')
    }
  }
}
