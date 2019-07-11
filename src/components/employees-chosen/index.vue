<!--公用组件：人员选择组件
/**
* @author web-闫超
* @date 2018年7月19日
* @param v-model {String}                  ---数据模型绑定
* @param multiple {Boolean} [isObj]        ---是否多选
* @param closeOnSelect {Boolean} [label]   ---单选时，选择后是否立即关闭页面
* @param isEdit {Boolean} [label]   ---  是否可以编辑回显值 默认可以编辑
* @example 调用示例
*    <employees-chosen v-model="followInfoTags">
                    <el-button type="text" class="el-icon-plus ba d-text-blue ml10 d-pointer" ></el-button>
     </employees-chosen>
**/
-->

<template>
  <el-popover
    placement="bottom"
    v-model="visible"
    @show="initData"
    trigger="click">
    <div class="label-filter p5 pt0">
      <el-container class="employees-chosen">
        <el-header v-if="multiple" class="selected-employees d-auto-y">
          选中的人员:
          <el-tag
            v-for="tag in partSelectedEmployees"
            :key="tag"
            size="mini"
            class="mr10 mb5"
            :closable="isEdit || !storeSelectedEmployees.includes(tag) "
            @close="handleCloseTag(tag)"
            type="primary">
            {{tag.split(separator)[0]}}
          </el-tag>
        </el-header>
        <el-main class="p10">
          <el-container>
            <el-aside style="width:250px; height:400px;">
              <el-tree
				v-loading="loadingDept"
                :data="deptTreeList"
                :props="{label: 'deptName'}"
                ref="tree"
                :highlight-current="true"
                node-key="id"
                default-expand-all
                @current-change="deptChanged"
                :expand-on-click-node="false">
              </el-tree>
            </el-aside>
            <el-main class="employee-main">
              <div class="w200">
                <el-input
                  placeholder="请输入姓名"
                  prefix-icon="el-icon-search"
                  size="mini"
                  @input="doFilter"
                  v-model="employeeFilter">
                </el-input>
                <div class="label-select employee-container" v-loading="loadingEmployees">
                  <div v-if="!employeeList.length" class="ac p10">暂无数据！</div>
                  <component size="mini" v-else :is="multiple ? 'el-checkbox-group' : 'el-radio-group'"
                             v-model="partSelectedEmployees"
                             class="wfull"
                             @change="onSelectChange">
                    <component size="mini" :disabled="!(isEdit || !storeSelectedEmployees.includes(employee))"
                               :is="multiple ? 'el-checkbox-button' : 'el-radio-button'"
                               v-for="employee in employeeList"
                               :label=" employee.employeeName + separator + employee.id + separator + employee.userId"
                               :key="employee.userId">
                      {{employee.employeeName}}
                    </component>
                  </component>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-main>
        <el-footer v-if="multiple || !closeOnSelect">
          <div style="text-align: center; margin: 0">
            <el-button size="mini" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="saveAndClose">确定</el-button>
          </div>
        </el-footer>
      </el-container>
    </div>
    <slot slot="reference"></slot>
  </el-popover>
</template>
<script>
  export default {
    props: {
      value: {},
      multiple: {
        type: Boolean,
        default: true,
      },
      closeOnSelect: {
        type: Boolean,
        default: true
      },
      isEdit: {
        type: Boolean,
        default: true,
      }
    },
    data() {
      return {
	    separator: ',',  //拼接分隔符，之所以拼接，是因为checkbox选择项取得label值，只有id或者名字使用起来特别不方便
        loadingDept: false, //部门加载标识
        loadingEmployees: false, //人员加载标识
        deptLoaded: false, //部门是否加载完成
        visible: false,
        deptTreeList: [],
        employeeList: [],  // 当前部门下所有人员列表（过滤）
        storedEmployeeList: [], // 当前部门下所有人员列表
        employeeFilter: '',
        partSelectedEmployees: this.multiple ? [] : '',  //当前选择人员列表
        storeSelectedEmployees: [], //已选择人员列表
      };
    },
    computed: {},
    created() {
    },
    methods: {
      getDeptList() {
        if (this.deptLoaded || this.loadingDept) {
          return
        }
		
		this.loadingDept = true
        this.$api.bizSystemService.getDeptList({type: 0})
          .then(res => {
            if (res.code === 200) {
              this.deptLoaded = true

              let data = res.data || [];
              this.deptTreeList = data
              if (data.length) {
                this.$nextTick(() => {
                  this.deptChanged(this.deptTreeList[0]);
                });
              }
            }
          }).finally(() => {
          this.loadingDept = false
        })
      },
      initData: function () {
        this.getDeptList()

        if (this.multiple) {
          this.storeSelectedEmployees = []
          this.partSelectedEmployees = [];
          for (let item of this.value) {
            if (item.userId && item.employeeName) {
              this.partSelectedEmployees.push(item.employeeName + this.separator + item.id + this.separator + item.userId);
              this.storeSelectedEmployees.push(item.employeeName + this.separator + item.id + this.separator + item.userId);
            }
          }
        } else {
          this.partSelectedEmployees = !this.value ? '' : (this.value.employeeName + this.separator + item.id + this.separator + this.value.userId);
        }
      },
      deptChanged: function (dept) {
        this.employeeFilter = '';
        this.loadingEmployees = true;

        this.$api.bizSystemService.getEmployeesUserByDeptId({deptId: dept.id}).then(res => {
          this.employeeList = this.storedEmployeeList = res.data
        }).finally(() => {
          this.loadingEmployees = false;
        })
      },
      doFilter: function () {
        let employeeFilter = this.employeeFilter;

        this.employeeList = this.storedEmployeeList.filter((employee) => {
          return employee.employeeName.toLowerCase().indexOf(employeeFilter.toLowerCase()) !== -1;
        })
      },
      handleCloseTag: function (tag) {
        this.partSelectedEmployees.splice(this.partSelectedEmployees.indexOf(tag), 1);
      },
      onSelectChange: function () {
        if (!this.multiple && this.closeOnSelect) {
          this.saveAndClose()
        }
      },
      saveAndClose: function () {
        this.visible = false;
		
        let toObj = (e) => {
          if (!e) {
            return {};
          }
          let [employeeName, id, userId] = e.split(this.separator);
          return {
            employeeName,
			id,
            userId
          }
        };
        this.$emit('fUpdate')
        this.$emit('input', !this.multiple ? toObj(this.partSelectedEmployees) : this.partSelectedEmployees.map(toObj))
      }
    }
  }
</script>
<style scoped lang="scss">
  .employees-chosen {
    .selected-employees{
      width: 490px;
    }

    .employee-main {
      padding: 0;
      margin-left: 20px;

      .employee-container {
        overflow-x: hidden;
        margin-top: 10px;
        overflow-y: auto;
        max-height:362px;
        min-height: 200px
      }
    }

    /deep/
     .label-select {
      .el-radio-button, .el-checkbox-button {
        margin: 2px;
        padding: 5px;
      }

      .el-radio-button.is-active, .el-checkbox-button.is-checked {
        color: #409EFF;
        background: #f9f9f9;
      }

      .el-radio-button:hover,  .el-checkbox-button:hover {
        background: #f3f3f3;
      }

      .el-checkbox-button .el-checkbox-button__inner,.el-radio-button .el-radio-button__inner {
        text-align: left;
        background-color: transparent;
        color: #409EFF;
        box-shadow: none;
        border: 0;
      }

      .el-radio-button, .el-checkbox-button, .el-checkbox-button__inner, .el-radio-button__inner {
        width: 100%;
      }

      .el-checkbox-button.is-checked .el-checkbox-button__inner:before, .el-radio-button.is-active .el-radio-button__inner:before {
        content: "\E611";
        position: absolute;
        right: 20px;
        display: inline-block;
        vertical-align: middle;
        font-family: element-icons !important;
      }
    }
  }
</style>
