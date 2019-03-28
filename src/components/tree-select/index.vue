<!--公用组件：下拉树列表
/**
* @author web-王晓冬
* @date 2019年3月21日
* @params value v-model 值
* @param api {String}                  ---api接口 微服务名称.url方法名称  必填
* @param params {Object}               ---接口参数;  默认{ page: 1, limit: 15 }
* @params props 同 el-tree 组件的props
* @params node-key 同 el-tree 组件的 node-key
* @params defaultExpandAll 树菜单是否展开全部 默认false
* @params multiple 同el-select 的 multiple
* @params placeholder 同el-select 的 placeholder
* @params collapse-tags 同el-select 的 collapse-tags
* @params size 同el-select 的 size
*  单选调用（传入字符串）：<select-tree :data='departAll' v-model="string"></select-tree>
*  多选调用（传入数组）：<select-tree :data='departAll' multiple v-model="returnArray"></select-tree>
**/
-->
<template>
  <el-popover placement="bottom-start" width="200" trigger="click" v-model="isShowSelect">
    <el-tree
      v-loading="loading"
      style="height:300px;overflow-y: scroll;"
      v-if="isShowSelect"
      :data="treeDatas"
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
    <el-select slot="reference" :collapse-tags="collapseTags" ref="select"  v-model="modelValue" :size="size" :value-key="nodeKey" :clearable="true" :multiple="multiple" :placeholder="placeholder">
      <el-option v-for="(item,index) in options" :key="index" :label="item[props.label]" :value="item[nodeKey]"></el-option>
    </el-select>
  </el-popover>
</template>
<script>
export default {
  props: {
    value:{ required: true },
    data: { type: Array,},
    //请求接口
    api: {
      required: false
    },
    params: {
      type: [Object,String,Number],
    },
    collapseTags:{
      type: Boolean,
      default: false
    },
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
      loading:false,
      treeData:[],
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
      this.findTreeNode(this.treeDatas,val)
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
  created() {
    if(this.api){
      this.init(this.params);
    }
  },
  computed:{
    treeDatas(){
      return this.api?this.treeData:this.data
    },
    // 实时更新server
    server(){
      return this.api.split('.')[0]
    },
    // 实时更新url
    url(){
      return this.api.split('.')[1]
    },
    modelValue:{
      get(){
        this.findTreeNode(this.treeDatas,this.value)
        return this.value
      },
      set(val){
        this.$emit('input',val)
      },
    }
  },
  methods: {
    init(params) {
      this.loading = true;
      this.$api[this.server][this.url](params)
        .then(res => {
          this.treeData = res.data || [];
          this.findTreeNode(this.treeData,this.value)
        })
        .finally(() => {
          //关闭loading
          this.loading = false; 
        });
    },
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
      this.$emit('input',this.options.map(item=>item[this.nodeKey]))
    },
    // 递归查询树形节点
    findTreeNode (tree, val) {
      if (this.value || (this.value || []).length) {
        if(this.multiple){
          tree.forEach(item=>{
            if(val.includes(item[this.nodeKey])){
              this.options.push(item)
            }
            if((item[this.props.children || 'children'] || []).length){
              this.findTreeNode(item[this.props.children || 'children'], val)
            }
          })
        }else{
          for (var i = 0; i < tree.length; i++) {
            if (tree[i][this.nodeKey] == val) {
              this.options = [tree[i]]
              break;
            } else if ((tree[i][this.props.children || 'children'] || []).length) {
              this.findTreeNode(tree[i][this.props.children || 'children'], val)
            }
          }
        }
      }
    }
  }
}
</script>