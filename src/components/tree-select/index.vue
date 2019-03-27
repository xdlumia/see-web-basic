<!--公用组件：下拉树列表
/**
* @author web-王晓冬
* @date 2019年3月21日
* @params value v-model 值
* @params props 同 el-tree 组件的props
* @params nodeKey 同 el-tree 组件的 nodeKey
* @params defaultExpandAll 树菜单是否展开全部 默认false
* @params multiple 同el-select 的 multiple
* @params placeholder 同el-select 的 placeholder
* @params size 同el-select 的 size
*  单选调用（传入字符串）：<select-tree :data='departAll' v-model="string"></select-tree>
*  多选调用（传入数组）：<select-tree :data='departAll' multiple v-model="returnArray"></select-tree>
**/
-->
<template>
  <el-popover placement="bottom-start" width="200" trigger="click" v-model="isShowSelect">
    <el-tree
      style="height:300px;overflow-y: scroll;"
      v-if="isShowSelect"
      :data="data"
      :check-strictly="true"
      :node-key="nodeKey"
      :show-checkbox="multiple"
      :expand-on-click-node="multiple"
      :default-expanded-keys="defaultExpandedKeys"
      :default-checked-keys="defaultCheckedKeys"
      :default-expand-all="defaultExpandAll"
      highlight-current
      @node-click="handleNodeClick"
      @check="getKeys"
      :props="props"
    ></el-tree>
    <el-select slot="reference" ref="select"  v-model="modelValue" :size="size" :value-key="nodeKey" :clearable="true" :multiple="multiple" :placeholder="placeholder">
      <el-option v-for="(item,index) in options" :key="index" :label="item[props.label]" :value="item[nodeKey]"></el-option>
    </el-select>
  </el-popover>
</template>
<script>
export default {
  props: {
    value:{ required: true },
    data: { type: Array, required: true },
    props:{},
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    size:{type: String,default: 'small'},
    nodeKey: { type: String, default: 'id' },
    placeholder: { type: String, default: '请选择' }
  },
  data () {
    return {
      // 是否显示树状选择器
      isShowSelect: false,
      options: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
    }
  },
  watch: {
    isShowSelect (val) {
      // 隐藏select自带的下拉框
      this.$refs.select.blur()
      if (val) {
        this.defaultCheckedKeys = this.multiple?this.value:[this.value]
        this.defaultExpandedKeys = this.multiple?this.value:[this.value]
      }
    },
    value(val){
      this.findTreeNode(this.data,val)
    },
    data:{
      handler:function(data){
        this.findTreeNode(data,this.value)
      },
      deep:true
    }
    
  },
  mounted () {
  },
  computed:{
    modelValue:{
      get(){
        return this.value
      },
      set(val){
        this.$emit('input',val)
      },
    }
  },
  methods: {
    handleNodeClick (data) {
      if (!this.multiple) {
        this.options = [data]
        this.$emit('input',data[this.nodeKey])
        this.isShowSelect = !this.isShowSelect
      }
    },
    // 点击多选框选中
    getKeys (data, checked) {
      this.options = checked.checkedNodes
      this.$emit('input',this.options.map(item=>item.id))
    },
    // 递归查询树形节点
    findTreeNode (tree, val) {
      if (this.value || (this.value || []).length) {
        if(this.multiple){
          for (var i = 0; i < tree.length; i++) {
            if (val.includes(tree[i][this.nodeKey])) {
              this.options.push(tree[i])
            } else if ((tree[i].children || []).length) {
              this.findTreeNode(tree[i].children, val)
            }
          }
        }else{
          for (var i = 0; i < tree.length; i++) {
            if (tree[i][this.nodeKey] == val) {
              this.options = [tree[i]]
              break;
            } else if ((tree[i].children || []).length) {
              this.findTreeNode(tree[i].children, val)
            }
          }
        }
        
      }
    }
  }
}
</script>