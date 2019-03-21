<!--公用组件：下拉树列表
/**
* @author web-王晓冬
* @date 2019年3月21日
*  单选调用（传入字符串）：<select-tree :treeData='departAll' v-model="string"></select-tree>
*  多选调用（传入数组）：<select-tree :treeData='departAll' multiple v-model="returnArray"></select-tree>
**/
-->
<template>
  <el-popover placement="bottom-start" width="200" @hide="popoverHide" trigger="click" v-model="isShowSelect">
    <el-tree
      style="height:300px;overflow-y: scroll;"
      v-if="isShowSelect"
      :data="treeData"
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
      :props="defaultProps"
    ></el-tree>
    <el-select slot="reference" ref="select"  v-model="key" size="small" :clearable="true" :multiple="multiple" :placeholder="tipText" @click.native="isShowSelect = !isShowSelect">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </el-popover>
</template>
<script>
export default {
  props: {
    treeData: { type: Array, required: true },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    nodeKey: { type: String, default: 'id' },
    tipText: { type: String, default: '请选择' }
  },
  data () {
    return {
      // 是否显示树状选择器
      isShowSelect: false,
      options: [],
      key: [],
      showValueTmp: '',
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  watch: {
    isShowSelect (val) {
      // 隐藏select自带的下拉框
      this.$refs.select.blur()
      if (val) {
        // 下拉面板展开-选中节点-展开节点
        this.setTreeCheckNode(this.key)
        this.defaultCheckedKeys = this.key
        this.defaultExpandedKeys = this.key
      }
    },
    key (val) {
      if (this.multiple) {
        this.$emit('update:id', this.key)
      } else {
        this.$emit('update:id', this.key[0])
      }
    }
  },
  mounted () {
    // 把传进来的参数转成数组处理
    if (this.multiple && Array.isArray(this.id)) {
      this.key = this.id
    } else {
      this.key.push(this.id)
    }
    this.setTreeCheckNode(this.key)
  },
  methods: {
    handleNodeClick (data) {
      if (!this.multiple) {
        let tmpMap = {}
        tmpMap.value = data.id
        tmpMap.label = data.label
        this.options = []
        this.options.push(tmpMap)
        this.key = [data.id]
        this.isShowSelect = !this.isShowSelect
      }
    },
    getKeys (data, checked) {
      let tmp = []
      checked.checkedNodes.forEach(node => {
        let tmpMap = {}
        tmpMap.value = node.id
        tmpMap.label = node.label
        tmp.push(tmpMap)
      })
      this.options = tmp
      this.key = checked.checkedKeys
    },
    setTreeCheckNode (ids) {
      let tmp = []
      ids.forEach(id => {
        this.findTreeNode(this.treeData, id)
        tmp.push(this.showValueTmp)
      })
    },
    // 递归查询树形节点
    findTreeNode (tree, id) {
      if ((!validatenull(tree)) && (!validatenull(id))) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].id === id) {
            this.showValueTmp = tree[i].label
          } else if (tree[i].children != null && tree[i].children.length > 0) {
            this.findTreeNode(tree[i].children, id)
          }
        }
      }
    }
  }
}
</script>