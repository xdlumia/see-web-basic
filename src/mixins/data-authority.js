/** 用户数据权限校验方法
 * @author web-闫超
 * @date 2018年7月26日
 *
 **/
let authorityButtonTempObj = {}

export default {
  methods: {
    checkColumnDataPermission(code, fieldName) {
      let dataAuthList = this.$local.fetch('dataAuthList') || []

      for (let dataAuth of dataAuthList) {
        if (dataAuth.code === code) {
          for (let setting of dataAuth.colSetting || []) {
            if (setting.fieldCode === fieldName && setting.type === 1) {
              return true
            }
          }
        }
      }

      return false
    },
    /**
     * 校验用户[-option 在某些维度下]是否拥有某按钮权限
     * @param buttonCode 按钮权限码
     * @param targetId 主键id
     * @param targetType 维度类型,比如lp, dz,默认lp
     *
     **/
    checkAuthorityButton(buttonCode, targetId, targetType = 'lp') {
      if (!this.authorityButtons.includes(buttonCode)) {
        return false
      }

      if (!targetId) {
        return true
      }

      let temp;
      let authorityButtonTempObj = {}; // 先不缓存了
      // TODO：考虑放到vuex中，而不是localStorage
      if (!authorityButtonTempObj.__init) {
        let dataAuthList = this.$local.fetch('bizDataAuthCfgList') || []

        dataAuthList.forEach((item) => {
          temp = authorityButtonTempObj[item.funcCode] || (authorityButtonTempObj[item.funcCode] = {
            enable: item.enable
          });

          item.objlist.forEach((obj) => {
            (temp[obj.objectType] || (temp[obj.objectType] = [])).push(obj.objectId)
          })
        })

        authorityButtonTempObj.__init = true
      }

      return !!((temp = authorityButtonTempObj[buttonCode]) && (temp.enable === false || ((temp = temp[targetType]) && temp.includes(targetId))))
    }
  }
}
