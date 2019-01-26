<!--公用组件：人员选择组件
/**
* @author web-闫超
* @date 2018年7月19日
* @param v-model {String}                  ---数据模型绑定
* @param multiple {Boolean} [isObj]        ---是否多选
* @param closeOnSelect {Boolean} [label]   ---单选时，选择后是否立即关闭页面
* @example 调用示例
*    <employees-select v-model="followInfoTags">
     </employees-select>
**/
-->

<template>
  <el-select
    suffix-icon="el-icon-search"
    class="wfull"
    v-bind="[$props, $attrs]"
    :value-key="valueKey"
    remote
    filterable
    :remote-method="queryAllPersons"
    v-model="currentValue"
    :loading="loading"
    @change="handlePersonSelected"
    ref="select"
    placeholder="请输入内容"
  >
    <el-option
      v-for="item in options"
      :key="item[valueKey]"
      :label="item.employeeName"
      :value="isObj?item:item[valueKey]">
    </el-option>
  </el-select>
</template>
<script>
  import axios from 'axios'

  let baseURL = window.g.ApiUrl

  export default {
    props: {
      value: {},
      isObj: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        valueKey: 'userId',
        loading: false,
        currentId: '',
        currentValue: this.value,
        options: []
      }
    },
    created() {
      this.loadCurrentPerson(this.value)
    },
    mounted() {
      this.$refs.select.previousQuery = undefined
    },
    watch: {
      value: function (newValue) {
        this.currentValue = newValue
      }
    },
    methods: {
      queryAllPersons(queryString) {
        this.loading = true;
        // TODO: 这个地址在see-web-system
        this.$api.bizSystemService.fetchEmployeeList({
          page: 1,
          employeeName: queryString,
          limit: 20
        }).then((res) => {
          this.options = res.data
        }).finally(() => {
          this.loading = false;
        })
      },
      loadCurrentPerson(value) {
        // 去后台加载选项
        // TODO: 不应该从login取，并且需要合并请求
        if (!this.multiple) {
          if (this.isObj ? (value = value.userId) : value) {
            this.currentValue = ''

            axios.get(baseURL.login + '/rmUser/userInfo', {params: {id: value}}).then((res) => {
              if (!this.currentValue && res) {
                this.options = [{userId: value, employeeName: res.data.name}]
                this.currentValue = this.isObj ? this.options[0] : value
              }
            })
          }
        } else {
          if (this.value && this.value.length) {
            Promise.all(value.map(item => {
              return axios.get(baseURL.login + '/rmUser/userInfo', {params: {id: this.isObj ? item[this.valueKey] : item}})
                .then(res => {
                  return {userId: res.data.id, employeeName: res.data.name}
                })
            }))
              .then(options => {
                this.options = options
              })
          }
        }
      },
      generateByKey(key) {
        let result;

        for (let o of this.options) {
          if (o[this.valueKey] === key) {
            result = o;
            break;
          }
        }

        return result
      },
      handlePersonSelected(item) {
        this.$emit('input', item)

        // 先处理下单选
        if (!this.isObj && !this.multiple) {
          item = this.generateByKey(item)
        }
        this.$emit('onSelect', item)
      }
    }
  }
</script>
<style>
</style>
