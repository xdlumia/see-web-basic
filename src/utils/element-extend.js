/**
 * @desc elementUI扩展入口
 * @author 闫超
 * @date 2018年9月17日
 **/
import ElementUI from 'element-ui'


/**
 * 默认设置 el-input的最大长度是300
 * maxlength是通过attrs传递给实际的Input,暂时找不到任何合适的地方去修改attrs，因此只能覆盖下render方法，在render之前修改下
 */
ElementUI.Input.render = (function (old, defaultMaxLength) {
  return function () {
    if (this.$attrs.maxlength === undefined) {
      this.$attrs.maxlength = defaultMaxLength
    }

    return old.apply(this, arguments)
  }
})(ElementUI.Input.render, 300)


/**
 * 修改默认值“close-on-click-modal”，默认情况下点击modal不关闭dialog
 */
ElementUI.Dialog.props.closeOnClickModal.default = false


/**
 * InputNumber控制精度时，小数位全是0的时候，没必要强制显示小数位
 */
ElementUI.InputNumber.computed.currentInputValue = function currentInputValue() {
  /*    const currentValue = this.currentValue;
  if (typeof currentValue === 'number' && this.precision !== undefined) {
    return currentValue.toFixed(this.precision);
  } else {
    return currentValue;
  } */
  return this.currentValue
}

/**
 * 修改DatePicker的BUG:当前时间不可用的时候，点击回车仍然会赋值,
 * 增加判断if (!this.disabledDate || !this.disabledDate(this.date)) 如果当前时间被禁用了，不响应回车事件
 */
ElementUI.DatePicker.created = (function (old) {
  return function () {
    old.apply(this, arguments)

    if (this.type === 'daterange' || this.type === 'datetimerange') {
      return
    }

    this.panel.methods.handleKeydown = function handleKeydown(event) {
      let keyCode = event.keyCode
      let list = [38, 40, 37, 39]


      if (this.visible && !this.timePickerVisible) {
        if (list.indexOf(keyCode) !== -1) {
          this.handleKeyControl(keyCode)
          event.stopPropagation()
          event.preventDefault()
        }
        if (keyCode === 13 && this.userInputDate === null && this.userInputTime === null) {
          if (!this.disabledDate || !this.disabledDate(this.date)) {
            // Enter
            this.emit(this.date, false)
          }
        }
      }
    }
  }
})(ElementUI.DatePicker.created)