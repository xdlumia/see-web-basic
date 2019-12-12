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
    @show="initData"
    placement="bottom"
    trigger="click"
    v-model="visible"
  >
    <div class="label-filter p5 pt0">
      <el-container class="employees-chosen">
        <el-header
          class="selected-employees d-auto-y"
          v-if="multiple"
        >
          选中的人员:
          <el-tag
            :closable="isEdit || !storeSelectedEmployees.includes(tag) "
            :key="tag"
            @close="handleCloseTag(tag)"
            class="mr10 mb5"
            size="mini"
            type="primary"
            v-for="tag in partSelectedEmployees"
          >{{tag.split(separator)[0]}}</el-tag>
        </el-header>
        <el-main class="p10">
          <el-container>
            <el-aside style="width:250px; height:400px;">
              <el-tree
                :data="deptTreeList"
                :expand-on-click-node="false"
                :highlight-current="true"
                :props="{label: 'deptName'}"
                @current-change="deptChanged"
                default-expand-all
                node-key="id"
                ref="tree"
                v-loading="loadingDept"
              ></el-tree>
            </el-aside>
            <el-main class="employee-main">
              <div class="w200">
                <el-input
                  @input="doFilter"
                  placeholder="请输入姓名"
                  prefix-icon="el-icon-search"
                  size="mini"
                  v-model="employeeFilter"
                ></el-input>
                <div
                  class="label-select employee-container"
                  v-loading="loadingEmployees"
                >
                  <div
                    class="ac p10"
                    v-if="!employeeList.length"
                  >暂无数据！</div>
                  <div
                    :is="multiple ? 'el-checkbox-group' : 'el-radio-group'"
                    @change="onSelectChange"
                    class="wfull"
                    size="mini"
                    v-else
                    v-model="partSelectedEmployees"
                  >
                    <div
                      :disabled="!(isEdit || !storeSelectedEmployees.includes(employee))"
                      :is="multiple ? 'el-checkbox-button' : 'el-radio-button'"
                      class="el-icon-check"
                      :key="employee.userId"
                      :label="[ 
                        employee.employeeName, 
                        employee.id,
                        employee.userId,
                        employee.deptName,
                        employee.positionName
                      ].join(separator)"
                      size="mini"
                      v-for="employee in employeeList"
                    >{{employee.employeeName}}</div>
                  </div>
                </div>
              </div>
            </el-main>
          </el-container>
        </el-main>
        <el-footer v-if="multiple || !closeOnSelect">
          <div style="text-align: center; margin: 0">
            <el-button
              @click="visible = false"
              size="mini"
            >取消</el-button>
            <el-button
              @click="saveAndClose"
              size="mini"
              type="primary"
            >确定</el-button>
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
      default: true
    },
    closeOnSelect: {
      type: Boolean,
      default: true
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      separator: ',', //拼接分隔符，之所以拼接，是因为checkbox选择项取得label值，只有id或者名字使用起来特别不方便
      loadingDept: false, //部门加载标识
      loadingEmployees: false, //人员加载标识
      deptLoaded: false, //部门是否加载完成
      visible: false,
      deptTreeList: [],
      employeeList: [], // 当前部门下所有人员列表（过滤）
      storedEmployeeList: [], // 当前部门下所有人员列表
      employeeFilter: '',
      partSelectedEmployees: this.multiple ? [] : '', //当前选择人员列表
      storeSelectedEmployees: [] //已选择人员列表
    };
  },
  computed: {},
  created() { },
  methods: {
    getDeptList() {
      if (this.deptLoaded || this.loadingDept) {
        return;
      }

      this.loadingDept = true;
      this.$api.bizSystemService
        .getDeptList({ type: 0 })
        .then(res => {
          if (res.code === 200) {
            this.deptLoaded = true;

            let data = res.data || [];
            this.deptTreeList = data;
            if (data.length) {
              this.$nextTick(() => {
                this.deptChanged(this.deptTreeList[0]);
              });
            }
          }
        })
        .finally(() => {
          this.loadingDept = false;
        });
    },
    initData: function () {
      this.getDeptList();

      if (this.multiple) {
        this.storeSelectedEmployees = [];
        this.partSelectedEmployees = [];
        for (let item of this.value) {
          if (item.userId && item.employeeName) {
            let label = [
              item.employeeName,
              item.id,
              item.userId,
              item.deptName,
              item.positionName
            ]
              .map(a => a || '')
              .join(this.separator);
            this.partSelectedEmployees.push(label);
            this.storeSelectedEmployees.push(label);
          }
        }
      } else {
        this.partSelectedEmployees = !this.value
          ? ''
          : [
            this.value.employeeName,
            this.value.id,
            this.value.userId,
            this.value.deptName,
            this.value.positionName
          ]
            .map(a => a || '')
            .join(this.separator);
      }
    },
    deptChanged: function (dept) {
      this.employeeFilter = '';
      this.loadingEmployees = true;

      this.$api.bizSystemService
        .getEmployeesUserByDeptId({ deptId: dept.id })
        .then(res => {
          this.employeeList = this.storedEmployeeList = res.data;
        })
        .finally(() => {
          this.loadingEmployees = false;
        });
    },
    doFilter: function () {
      let employeeFilter = this.employeeFilter;

      this.employeeList = this.storedEmployeeList.filter(employee => {
        return (
          employee.employeeName
            .toLowerCase()
            .indexOf(employeeFilter.toLowerCase()) !== -1
        );
      });
    },
    handleCloseTag: function (tag) {
      this.partSelectedEmployees.splice(
        this.partSelectedEmployees.indexOf(tag),
        1
      );
    },
    onSelectChange: function () {
      if (!this.multiple && this.closeOnSelect) {
        this.saveAndClose();
      }
    },
    saveAndClose: function () {
      this.visible = false;

      let toObj = e => {
        if (!e) {
          return {};
        }
        let [employeeName, id, userId, deptName, positionName] = e.split(
          this.separator
        );
        return {
          employeeName,
          id,
          userId,
          deptName,
          positionName
        };
      };
      this.$emit('fUpdate');
      this.$emit(
        'input',
        !this.multiple
          ? toObj(this.partSelectedEmployees)
          : this.partSelectedEmployees.map(toObj)
      );
    }
  }
};
</script>
<style scoped lang="scss">
.employees-chosen {
  .selected-employees {
    width: 490px;
  }

  .employee-main {
    padding: 0;
    margin-left: 20px;

    .employee-container {
      overflow-x: hidden;
      margin-top: 10px;
      overflow-y: auto;
      max-height: 362px;
      min-height: 200px;
    }
  }
  /deep/ .label-select {
    .el-radio-button,
    .el-checkbox-button {
      margin: 2px;
      padding: 5px;
    }

    .el-radio-button.is-active,
    .el-checkbox-button.is-checked {
      color: #409eff;
      background: #f9f9f9;
    }

    .el-radio-button:hover,
    .el-checkbox-button:hover {
      background: #f3f3f3;
    }

    .el-checkbox-button .el-checkbox-button__inner,
    .el-radio-button .el-radio-button__inner {
      text-align: left;
      background-color: transparent;
      color: #409eff;
      box-shadow: none;
      border: 0;
    }

    .el-radio-button,
    .el-checkbox-button,
    .el-checkbox-button__inner,
    .el-radio-button__inner {
      width: 100%;
    }

    .el-checkbox-button.is-checked:before,
    .el-radio-button.is-active:before {
      font-size: 18px;
      color: #409eff;
      position: absolute;
      right: 20px;
      display: inline-block;
      vertical-align: middle;
      font-family: element-icons !important;
    }
  }
}
</style>
