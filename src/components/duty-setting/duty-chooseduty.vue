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
                    :disabled="!this.selectedIds.length"
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
                        <div class="h500 wfull pl10 d-auto-y">
                            <div class="pl10" v-if="deptName">{{deptName}}部门成员</div>
                            <multiSelect
                                v-model="selectedIds"
                                :multi="dialogMeta.isMulti"
                                :value="selectedIds"
                                :list="employList"
                                identity="userId"
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
import multiSelect from './duty-multiselect'; // 排列卡片多选
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
            employList: [], // 人员显示列表
            selectedIds: [], // 选中的人员ids
            userList: [], // 所有的用户列表
            tree: [], // 初始树列表
            deptId: '', //选中的部门ID
            deptName: '', //选中的部门名
            parentData: {}, // 父级关系
            flatList: [],
            saving: false // 保存操作
        };
    },
    computed: {},
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
            if (this.dialogMeta.userIds) {
                this.selectedIds = this.dialogMeta.userIds;
                this.userList.some(item => {
                    if (this.dialogMeta.userIds.includes(item.userId)) {
                        this.expandedIds = [item.deptId];
                        this.flatList.some(dept => {
                            if (dept.id == item.deptId) {
                                this.handleNodeClick(dept);
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
            this.deptName = data.deptName;
            this.typeName = data.typeName;
            this.deptId = data.id;
            this.deptName = data.deptName;
            this.totalCode = data.totalCode;
            this.employList = this.userList.filter(
                item => item.deptId == this.deptId
            );
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
        choosePeople(data) {
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
            }
        },
        peopleChanged() {},
        // 关闭当前弹框
        close(users) {
            this.$emit('close', users);
        },
        // 保存选择数据
        async save() {
            if (this.selectedIds.length) {
                let {
                    funcCode,
                    funcDesc,
                    syscode,
                    objectIds,
                    objectNames
                } = this.dialogMeta;
                await this.$confirm(
                    `即将修改【${objectNames.join(
                        ','
                    )}】等楼盘的${funcDesc},是否确认修改？`,
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
                                objectType: 'lp',
                                targetUserIds: this.selectedIds
                            },
                            { funcCode, funcDesc, syscode, objectIds }
                        )
                    );
                    // 向父级传递回显信息
                    let users = this.userList
                        .filter(item => this.selectedIds.includes(item.userId))
                        .map(item => {
                            return {
                                funcCode,
                                funcDesc,
                                empobj: item
                            };
                        });
                    this.saving = false;
                    this.close(users);
                } catch (e) {
                    this.saving = false;
                }
            }
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
</style>

