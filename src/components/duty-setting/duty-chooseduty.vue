<!--
  /**
 * 责任人选择弹框
 * @author 赵伦
 * @date 2019/3/25
 */
 -->
 <template>
    <div>
        <el-dialog
            :visible.sync="dialogMeta.visible"
            :append-to-body="true"
            :close-on-click-modal="false"
            v-dialogDrag
            top="20px"
            width="800px"
        >
            <div slot="title">
                <i class="el-icon-share"></i>
                <span v-html="dialogMeta.title||'添加责任人'"></span>
                <el-button
                    class="fr float-savebtn"
                    type="primary"
                    size="mini"
                    @click="save"
                    :loading="saving"
                >保存</el-button>
            </div>
            <div>
                <el-row>
                    <el-col :span="8">
                        <div class="h500 wfull border-right-dash pr10">
                            <el-autocomplete
                                class="wfull"
                                placeholder="请输入成员名称"
                                value-key="employeeName"
                                value="value"
                                :fetch-suggestions="filterPeople"
                                @select="choosePeople"
                                v-model="searchPeople"
                            ></el-autocomplete>
                            <div class="tree-table mt10">
                                <el-tree
                                    class="filter-tree d-bg-gray"
                                    ref="tree"
                                    node-key="id"
                                    auto-expand-parent
                                    :default-expanded-keys="expandedIds"
                                    :data="deptTree"
                                    :props="treeProps"
                                    :filter-node-method="filterNode"
                                    @node-click="handleNodeClick"
                                ></el-tree>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="16">
                        <div class="h500 wfull pl10 d-auto-y" ref="scrollContainer">
                            <div class="pre-choose-list">
                              <div class="pl10">当前选择:</div>
                              <div v-if="!selectedIds.length" class="ac d-text-gray" style="height: 97px;line-height: 97px"> 暂无 </div>
                              <span
                                class="pre-choose-people"
                                :key="userId + 'current_select'"
                                v-for="(userId,index) of  selectedIds"
                              >
                                    <span class="close" :class="{selected:true}" @click="selectedIds.splice(index, 1)" title="移除">×</span>
                                    <peopleCard :user="userList.find(emp=> emp.userId === userId)" :selected="true"></peopleCard>
                                </span>
                            </div>
                            <div class="pl10" v-if="deptName">{{deptName}}部门成员</div>
                            <multiSelect
                                :multi="dialogMeta.isMulti"
                                :value="selectedIds"
                                :list="employList"
                                identity="userId"
                                ref="peopleList"
                                @change="peopleChanged"
                            >
                                <template v-slot:card="{item,selected}">
                                    <peopleCard :user="item" :selected="selected"></peopleCard>
                                </template>
                            </multiSelect>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import multiSelect from './category-community/duty-multiselect'; // 排列卡片多选
import peopleCard from './duty-peoplecard'; // 责任人卡片
/**
 * 责任人选择弹框
 * @author 赵伦
 * @date 2019/3/25
 */
export default {
    components: {
        multiSelect,
        peopleCard
    },
    props: ['dialogMeta'],
    data() {
        return {
            searchPeople: '', // 筛选人员列表
            expandedIds: [], // 展开的id
            deptTree: [], // 部门树
            treeProps: {
                children: 'children', // 树形子数据字段
                label: 'deptName' // 树形显示字段
            },
            selectedIds: [], // 选中的人员ids
            userList: [], // 所有的用户列表
            tree: [], // 初始树列表
            deptId: '', //选中的部门ID
            deptName: '', //选中的部门名
            parentData: {}, // 父级关系
            flatList: [],
            allowDiffDept: true, // 是否允许跨部门选择
            preChooseList: [], // 之前选择的人
            saving: false // 保存操作
        };
    },
    computed: {
        canSave(){
            if(this.selectedIds.length){
                return true;
            }
            return this.preChooseList.some(item=>item.$$selected);
        },
        // 当前部门人员
        employList() {
          return this.userList.filter(
            item => item.deptId == this.deptId
          );
        },
        currentDeptSelect() {

        }
    },
    created() {
        this.getList();
    },
    mounted() {},
    watch: {},
    methods: {
        // 获取初始树形结构和所有的人员列表
        async getList() {
            let {
                data
            } = await this.$api.seeContractDutyService.queryUserListByRightCode(
                {
                    // rightCode: 'asystem_business_receive_approve_3003',
                    rightCode: this.dialogMeta.funcCode
                }
            );
            let { deptTree, userlist } = data;
            this.deptTree = deptTree;
            this.tree = [].concat(deptTree);
            this.expandedIds = [this.deptTree[0].id];
            this.userList = userlist;
            let findData = this.findParent(this.tree);
            this.parentData = findData.parentData;
            this.flatList = findData.allList;
            this.handleNodeClick(this.deptTree[0]);
            if (this.dialogMeta.userIds) {
                this.selectedIds = this.dialogMeta.userIds;
               // this.savePreSelectPeople();
                this.userList.some(item => {
                    if (this.dialogMeta.userIds.includes(item.userId)) {
                        this.expandedIds = [item.deptId];
                        this.flatList.some(dept => {
                            if (dept.id == item.deptId) {
                                this.handleNodeClick(dept);
                                //this.savePreSelectPeople();
                                return true;
                            }
                        });
                        return true;
                    }
                });
            }
        },
        // 查找父级关系列表
        findParent(tree, parent) {
            let parentData = {};
            let allList = [];
            tree.map(item => {
                allList.push(item);
                if (parent) {
                    parentData[item.id] = {
                        id: parent.id,
                        name: parent.deptName
                    };
                }
                if (item.children) {
                    let {
                        parentData: _parentData,
                        allList: _allList
                    } = this.findParent(item.children, item);
                    Object.assign(parentData, _parentData);
                    allList = allList.concat(_allList);
                }
            });
            return { parentData, allList };
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.deptName.indexOf(value) !== -1;
        },
        // 处理树形节点点击
        async handleNodeClick(data) {
            // 点击部门
            if (this.deptId != data.id) {
                this.deptName = data.deptName;
                this.typeName = data.typeName;
                this.deptId = data.id;
                this.deptName = data.deptName;
                this.totalCode = data.totalCode;

               // this.savePreSelectPeople();
            }
        },
        removePreChoose(item){
            this.preChooseList.some((p,i)=>{
                if(p==item){
                    this.preChooseList.splice(i,1);
                    this.selectedIds=this.selectedIds.filter(id=>id!=p.userId)
                    return true;
                }
            })
        },
        // /**保存其他部门已经选择的人 */
        // savePreSelectPeople() {
        //     if (this.allowDiffDept) {
        //         let preList = this.preChooseList.filter(
        //             item => item.$$selected
        //         );
        //         let preUserIds = preList.map(item => item.userId);
        //         let notIncludes = this.selectedIds.filter(
        //             id => !preUserIds.includes(id)
        //         );
        //         let users = this.userList.filter(item =>
        //             notIncludes.includes(item.userId)
        //         );
        //         let nowSelected = [];
        //         this.employList.map(item => {
        //             if (preUserIds.includes(item.userId)) {
        //                 nowSelected.push(item.userId);
        //             }
        //         });
        //         this.selectedIds = nowSelected;
        //         this.preChooseList = preList
        //             .concat(users)
        //             .sort((a, b) => (a.deptId < b.deptId ? -1 : 1))
        //             .map(item => {
        //                 this.$set(item, '$$selected', true);
        //                 return item;
        //             });
        //     }
        // },
        /**删除其他部门已经选择的人 */
        delPreChoose(user) {
            user.$$selected = !user.$$selected;
            if (!user.$$selected) {
                if (this.selectedIds.includes(user.userId)) {
                    this.selectedIds = this.selectedIds.filter(
                        id => id != user.userId
                    );
                }
            }
        },
        filterPeople(text, cb) {
            // 输入框过滤人员列表
            if (text) {
                let users = this.userList
                    .filter(item =>
                        new RegExp(`${text}`).test(item.employeeName)
                    )
                    .sort((a, b) => (a > b ? 1 : -1));
                cb(users);
            } else cb([]);
        },
        // 自动补充选择某个人
        async choosePeople(data) {
            this.expandedIds = [data.deptId];
            let node;
            this.flatList.some(item => {
                if (item.id == data.deptId) {
                    node = item;
                    return true;
                }
            });
            if (node) {
                this.handleNodeClick(node);
                this.selectedIds.push(data.userId);
                await this.sleep(200);
                this.scrollToPeople(data.userId);
            }
        },
        sleep(timeout) {
            return new Promise(r => {
                setTimeout(() => r(), timeout);
            });
        },
        /**自动滚动到某个人 */
        async scrollToPeople(userId) {
            let dom;
            let peopleDom;
            this.$refs.peopleList.$children.map(item => {
                if (item.user.userId == userId) {
                    peopleDom = item.$el;
                    dom = item.$el.parentElement;
                }
            });
            if (dom) {
                peopleDom.classList.remove('checked');
                await this.sleep(500);
                let top = dom.offsetTop;
                this.$refs.scrollContainer.scrollTop = top;
                peopleDom.classList.add('checked');
            }
        },
        peopleChanged(newV, oldV, list, item) {
            if (this.allowDiffDept) {
              if (item.$$checked) {
                this.selectedIds.push(item.userId)
              } else {
                this.selectedIds.splice( this.selectedIds.indexOf(item.userId), 1)
              }
            }
        },
        // 关闭当前弹框
        close(users) {
            this.$emit('close', users);
        },
        // 保存选择数据
        async save() {
            let selectedIds = this.selectedIds;
            if (this.allowDiffDept) {
                // selectedIds = [].concat(
                //     this.selectedIds,
                //     this.preChooseList
                //         .filter(item => item.$$selected)
                //         .map(item => item.userId)
                // );
                // selectedIds = selectedIds.filter(
                //     (item, index) => selectedIds.indexOf(item) == index
                // );
            }
            // if (selectedIds.length) {
                let {
                    funcCode,
                    funcDesc,
                    syscode,
                    objectIds,
                    objectType,
                    objectNames
                } = this.dialogMeta;
                await this.$confirm(
                    `即将修改${objectNames}的${funcDesc},是否确认修改？`,
                    '确认信息',
                    {
                        distinguishCancelAndClose: true,
                        type: 'warning',
                        confirmButtonText: '确认',
                        cancelButtonText: '放弃'
                    }
                );
                try {
                    this.saving = true;
                    await this.$api.seeContractDutyService.getCfgObjectDataAuthSave(
                        Object.assign(
                            {
                                objectType: objectType,
                                targetUserIds: selectedIds
                            },
                            { funcCode, funcDesc, syscode, objectIds }
                        )
                    );
                  let employMap =  {}

                    this.userList.forEach(item => {
                      employMap[item.userId] = item
                    })
                    // 向父级传递回显信息
                    let users = selectedIds.map((id) => {
                      return {
                        funcCode,
                        funcDesc,
                        empobj: employMap[id]
                      };
                    })
                    this.saving = false;
                    this.close(users);
                } catch (e) {
                    this.saving = false;
                }
            // }
        }
    }
};
</script>
<style lang="scss" scoped>
.border-right-dash {
    border-right: 2px dashed #ededed;
}
.tree-table {
    height: calc(100% - 50px);
    overflow-y: auto;
}
.float-savebtn {
    margin-right: 30px;
}
.h500 {
    height: 500px;
}
.pre-choose-list {
    width: 100%;
    display: inline-block;
    .pre-choose-people{
        position: relative;
        display: inline-block;
        .close{
            position: absolute;
            right: 14px;
            top: 13px;
            z-index: 1;
            cursor: pointer;
            line-height: 12px;
            color:#189eff;
            &.selected{
                color: #fff;
            }
            &:hover{
                color: #ec5555;
            }
        }
    }
}
</style>

