<!--公用组件：表格列表
/**
* @author web-王晓冬
* @date 2018年9月10日
* @param api {String}                  ---api接口 微服务名称.url方法名称  必填
* @param params {Object}               ---接口参数;  默认{ page: 1, limit: 15 }
* @param size {String}                 ---表格size 
* @param paging {Boole}                ---是否显示分页   默认true
* @param dragClass {string}             ---是否拖动 以及为列表中对象设置手柄，按住对象的拖动手柄才可以进行拖动  
* @param rowClassName {string function} ---定义拖动的class. 返回参数要和dragClass相同. 具体使用方式参考element ui
* @param slot                          ---slot
* @fucnton dragEnd  ---拖动结束的参数. 返回拖动修改后的数据

* @example 调用示例  接近element 原生表格.
*   已经全局引入 不需要单独引入
    <d-table 
    drag-class="drag"
    row-class-name="drag"
    @dragEnd="dragEnd"
    api="bizSystemService.getEmployeeList"
    :params="queryForm"
    size="small">
    <el-table-column
            align="center"
            label="序号"
            width="50">
            <template slot-scope="scope">
            {{scope.$index+1}}
            </template>
        </el-table-column>
        <el-table-column
            prop="roleTypeName"
            align="center"
            label="角色类型"
            width="120">
            <template slot-scope="scope">
            <el-button @click="dragClassClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
        </template>
        </d-table-column>
    </el-table>
**/
-->
<template>
    <div>
        <!-- 表格数据 -->
        <el-table
        row-key="id"
        :class="dragClass"
        :row-class-name="rowClassName"
        highlight-current-row
        :data="tableData"
        :reserve-selection="true"
        :border="border"
        :style="{height:tableHeight}"
        v-loading="loading"
        :size="size"
        @sort-change = "sortChange"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @row-click = "rowClick"
        style="width: 100%:overflow-y:auto"
        ref="elTable">
            <slot></slot>
        </el-table>
        <el-pagination
        v-if="paging"
        @size-change="limitChange"
        @current-change="pageChange"
        :current-page.sync="params.page"
        :page-size="params.limit"
        :page-sizes="[10, 15, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableCount">
        </el-pagination>
    </div>
</template>
<script>
import Sortable from 'sortablejs' 
export default {
  props: {
    //请求接口
    api: {
      required: true
    },
    //参数
    params: {
      type: [Object,String,Number],
      default: function() {
        return { page: 1, limit: 15 };
      }
    },
    // 尺寸
    size: {
      default: 'small'
    },
    // 尺寸
    border: {
      default: true
    },
    // 分页
    paging: {
      default: true
    },
    dragClass:{
      default: 'elTableDragDefault'
    },
    // 自定义行class
    rowClassName: {
      default:function(){
        return this.dragClass
      }
    },
  },
  data() {
    return {
      tableCount: 0, //总条数
      tableData: [], //表格数据
      loading: false, //loading动画
    };
  },
  created() {
    this.init(this.params);
    this.$nextTick(() => {
      if(this.dragClass !== 'elTableDragDefault'){
        this.rowDrop()
      }
    })
  },
  computed: {
    // 实时更新server
    server:function(){
      return this.api.split('.')[0]
    },
    // 实时更新url
    url:function(){
      return this.api.split('.')[1]
    },
    tableHeight:function(){
      return this.paging?'calc(100% - 32px)':'100%'
    }
  },
  methods: {
    init(params) {
      this.loading = true;
      this.$api[this.server][this.url](params)
        .then(res => {
          this.tableData = res.data || [];
          // 如果有分页
          if(this.paging){
            this.tableCount = res.count || 0;
            this.params.page = res.curr || 0;
          }
        })
        .finally(() => {
          //关闭loading
          this.loading = false; 
        });
    },
    // 重新请求
    reload(page) {
      // 如果有分页
      if(this.paging && page){
        this.params.page = page;
      }
      // api动态加载完 开始重新请求数据
      this.$nextTick(()=>{
        this.init(this.params);
      })
    },
    // 多选
    selectionChange(val){
      this.$emit('selection-change',val)
    },
    // 单选
    currentChange(currentRow, oldCurrentRow){
      this.$emit('current-change',currentRow, oldCurrentRow)
    },
    rowClick(row, event, column){
      this.$emit('row-click',row, event, column)
    },
    // 排序
    sortChange(column, prop, order){
      this.$emit('sort-change',column, prop, order)
    },
    // 表格翻页
    pageChange(page) {
      this.params.page = page;
      this.init(this.params);
    },
    // 修改当前条数
    limitChange(limit){
      this.params.limit = limit;
      this.init(this.params);
    },
    // 清空多选
    clearSelection(){
      this.$refs.elTable.clearSelection();
    },
    // 行拖动
    rowDrop () {
        const tbody = document.querySelector(`.${this.dragClass} .el-table__body-wrapper tbody`)
        const _this = this
        Sortable.create(tbody, {
          handle: this.dragClass=='elTableDragDefault'?'':`.${this.dragClass}`,
          onEnd ({ newIndex, oldIndex }) {
            const currRow = _this.tableData.splice(oldIndex, 1)[0]
            _this.tableData.splice(newIndex, 0, currRow)
            _this.$emit('dragEnd',_this.tableData)
          }
      })
    },
  }
};
</script>