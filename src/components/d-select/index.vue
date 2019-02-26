<!--公用组件：公共下拉框
/**
* 侧边栏弹出框
* @compents 组件存放位置
* @desc 公共下拉框
* @author web-王晓冬
* @date 2018年7月19日
* @param {String} [value]    - v-mode的值
* @param {Boolean} [isObj]         - 输出的值是否是对象 默认false
* @param {String} [label]         - label值
* @param {String} [dicCode]         - 字典查询的code码
* @param {String} [valueKey]         - elementui 的value-key值 默认code
* @param {String} [placeholder]         -提示值 默认请选择
* @param {String} [size]         -下拉框大小 默认 small
* @param {Boolean} [isEmpty]         -下拉框大小 默认 false
* @example 调用示例
*  <d-select v-model="queryForm.acreage" valueKey="code" :isObj="true" lable="code" dicCode='FM_FANGYUAN_MJ'></d-select>
**/
-->

<template>
  <div class="side-content" style="display: block;">
    <template>
      <el-select @change="selectChange" class="wfull" :size="size" v-model="selectValue" :disabled="disabled" :value-key="valueKey" :placeholder="placeholder">
        <el-option v-if="isEmpty"  label="请选择" :value="isObj ? {} : '' "></el-option>
        <el-option
          v-for="(item,index) of dictionaryOptions(dicCode)"
          :key="index"
          :label="item[label]"
          :value="isObj?item:item[valueKey]">
        </el-option>
      </el-select>
    </template>
  </div>
</template>
<script>
export default {
  // value v-model 默认值
  // isObj 选取的值是否是对象 默认false
  props: {
    value: {
      required: true
    },
    isObj: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: 'content'
    },
    dicCode: {
      required: true,
      type: String
    },
    valueKey: {
      type: String,
      default: 'code'
    },
    size: {
      default: 'small'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isEmpty: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      selectValue: this.value,
      options: []
    }
  },
  watch: {
    value: function (newValue) {
      this.selectValue = newValue
    }
  },
  methods: {
    selectChange (val) {
      // 更新v-model 的值
      this.$emit('input', val)
      this.$emit('change', val)
    }

  }
}
</script>
