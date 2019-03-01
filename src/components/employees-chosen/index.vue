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
        <el-header v-if="multiple" class="selected-employees">
          选中的人员:
          <el-tag
            v-for="tag in partSelectedEmployees"
            :key="tag"
            size="mini"
            class="mr10"
            :closable="isEdit || !storeSelectedEmployees.includes(tag) "
            @close="handleCloseTag(tag)"
            type="primary">
            {{tag.split(',')[0]}}
          </el-tag>
        </el-header>
        <el-main class="p10">
          <el-container>
            <el-aside style="width:250px; height:400px;">
              <el-tree
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
                               :label=" employee.employeeName + ',' + employee.id + ',' + employee.userId"
                               :key="employee.id ">
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
        loadingEmployees: false,
        visible: false,
        deptTreeList: [],
        employeeList: [],
        storedEmployeeList: [],
        employeeFilter: '',
        partSelectedEmployees: this.multiple ? [] : '',
        storeSelectedEmployees: [],
      };
    },
    computed: {},
    created() {
      this.getDeptList()
    },
    methods: {
      getDeptList() {
        // deptTreeList 如果没有数据才加载,否则不加载
        // if(this.deptTreeList.length==0){}
        this.$api.bizSystemService.getDeptList({type: 0})
          .then(res => {
            if (res.code === 200) {
              let data = res.data || [];
              this.deptTreeList = data
              // this.$store.commit('chosenDeptTreeList',data)
              if (data.length) {
                this.$nextTick(() => {
                  // this.$refs.tree.setCurrentKey(this.deptTreeList[0].id)
                  this.deptChanged(this.deptTreeList[0]);
                });
              }
            }
          })
      },
      initData: function () {
        if (this.multiple) {
          this.storeSelectedEmployees = []
          this.partSelectedEmployees = [];
          for (let item of this.value) {
            if (item.id && item.employeeName) {
              this.partSelectedEmployees.push(item.employeeName + ',' + item.id + ',' + item.userId);
              this.storeSelectedEmployees.push(item.employeeName + ',' + item.id + ',' + item.userId);
            }
          }
        } else {
          this.partSelectedEmployees = !this.value ? '' : (this.value.employeeName + ',' + this.value.id + ',' + this.value.userId);
        }
      },
      deptChanged: function (dept) {
        this.employeeFilter = '';
        this.loadingEmployees = true;

        this.$api.bizSystemService.getEmployeePop({deptId: dept.id}).then(res => {
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
          let [employeeName, id, userId] = e.split(',');
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
  }
</style>
<style>
  /*
  * 改变el-radio,el-checkbox的显示样式，因为el-radio-button等元素是在子元素中，所以style不能加scoped
  **/
  .employees-chosen .label-select .el-radio-button,
  .employees-chosen .label-select .el-checkbox-button {
    margin: 2px;
    padding: 5px;
  }

  .employees-chosen .label-select .el-radio-button.is-active,
  .employees-chosen .label-select .el-checkbox-button.is-checked {
    color: #409EFF;
    background: #f9f9f9;
  }

  .employees-chosen .label-select .el-radio-button:hover,
  .employees-chosen .label-select .el-checkbox-button:hover {
    background: #f3f3f3;
  }

  .employees-chosen .label-select .el-checkbox-button .el-checkbox-button__inner,
  .employees-chosen .label-select .el-radio-button .el-radio-button__inner {
    text-align: left;
    background-color: transparent;
    color: #409EFF;
    box-shadow: none;
    border: 0;
  }

  .employees-chosen .label-select .el-radio-button,
  .employees-chosen .label-select .el-checkbox-button,
  .employees-chosen .label-select .el-checkbox-button__inner,
  .employees-chosen .label-select .el-radio-button__inner {
    width: 100%;
  }

  .employees-chosen .label-select .el-checkbox-button.is-checked .el-checkbox-button__inner:before,
  .employees-chosen .label-select .el-radio-button.is-active .el-radio-button__inner:before {
    content: "\E611";
    position: absolute;
    right: 20px;
    display: inline-block;
    vertical-align: middle;
    font-family: element-icons !important;
  }
</style>
