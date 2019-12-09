<template>
    <div>
        <div class="pb10">
            <el-input suffix-icon="el-icon-search" v-model="deptNameFilter" label="按部门名称"  placeholder="按部门名称">
            </el-input>
        </div>
        <el-tree
            style="height: calc(100% - 60px)"
            class="filter-tree d-bg-gray d-auto-y"
            v-loading="loadingDept"
            :highlight-current="true"
            ref="tree"
            node-key="id"
            auto-expand-parent
            default-expand-all
            :data="deptTreeList"
            :filter-node-method="filterNode"
            :props="treeProps"
            @current-change="deptChanged"
        >
             <span class="custom-tree-node" slot-scope="{ node}">
                  <span>{{ node.label }}</span>
                  <span>({{ node.label }})</span>
             </span>
        </el-tree>
    </div>
</template>
<script>

    export default {
        props: ['sysCode', 'funcCode'],
        data() {
            return {
                loadingDept: false, //部门加载标识
                deptTreeList: [],
                deptNameFilter: '',
                treeProps: {
                    children: 'children', // 树形子数据字段
                    label: 'deptName' // 树形显示字段
                },
                countCache: {}
            }
        },
        watch: {
            deptNameFilter(val) {
                this.$refs.tree.filter(val);
            }
        },
        created() {
            this.getDeptList();
        },
        mounted() {},
        methods: {
            getDeptList() {
                this.loadingDept = true
                this.$api.bizSystemService.getDeptList({type: 0}).then( res => {
                    this.deptTreeList = res.data

                    if (this.deptTreeList.length) {
                        this.$nextTick(() => {
                            this.$refs.tree.setCurrentKey(this.deptTreeList[0])
                            this.deptChanged(this.deptTreeList[0]);
                        });
                    }
                }).finally(() => {
                    this.loadingDept = false
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.deptName.indexOf(value) !== -1;
            },

            deptChanged(dept) {
                this.$emit('update:value', [dept.id])
            },
            initSubSetDialogMeta(subDialogMeta) {
              subDialogMeta.objectNames = "当前部门";
            }
        }
    };
</script>
<style lang="scss" scoped>
</style>
