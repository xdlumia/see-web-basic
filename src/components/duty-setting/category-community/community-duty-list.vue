<!--私有组件：合同责任人设置
/**
 * 责任人选择弹框
 * @author 赵伦
 * @date 2019/3/22
 * @params {Object} dialogMeta 弹框所需数据
 *    @property {Boolean} visible 控制弹框显示或隐藏
 *    @property {String} title 标题
 *    @property {String} parent 父级标题
 *    @property {String} syscode syscode
 *    @property {String} pageCode pageCode
 *    @property {Enum} module 所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
 */
-->
<template>
    <div class="d-bg-gray wfull">
        <el-row type="flex" align="middle">
            <el-col :span="8">
                <i class="el-icon-tickets"></i>
                <span>楼盘列表</span>
                <span class="d-text-qgray">● {{buildingCount}}</span>
            </el-col>
            <el-col :span="13" class="ar">
                <el-radio-group
                    v-model="queryForm.assignmentStatus"
                    @change="filter()"
                    size="mini"
                    text-color="#000"
                >
                    <!-- 分配中，已分配，待分配 -->
                    <!-- assignmentStatus: 分配状态: 0 全部 1 未分配  2 分配中  3 已分配   -->
                    <el-radio-button
                        :label="item.value"
                        :key="item.value"
                        v-for="item of assignmentStatusList"
                    >
                        <span class="d-text-green" v-if="item.value==3">●</span>
                        <span class="d-text-orange" v-else-if="item.value==2">●</span>
                        <span v-else>●</span>
                        <span>{{item.name}}</span>
                    </el-radio-button>
                </el-radio-group>
            </el-col>
            <el-col :span="3">
                <dutyFilter
                    class="contract-filter"
                    ref="contractFilter"
                    :params="queryForm"
                    :assignmentStatusList="assignmentStatusList"
                    @submit="filter()"
                ></dutyFilter>
            </el-col>
        </el-row>
        <!-- 楼盘卡片容器 -->
        <el-row class="d-bg-white mt10 d-auto-y" style="height: calc(100% - 60px);">
            <el-col :span="24">
                <multiSelect
                    :value="selectedBuildingIds"
                    :list="buildingList"
                    :max="maxSelect"
                    v-model="selectedBuildingIds"
                    identity="id"
                    multi
                    @change="buildingChanged"
                    @error="maxError"
                >
                    <template v-slot:card="{item,selected}">
                        <buildingCard v-if="item" :building="item" :selected="selected"></buildingCard>
                    </template>
                </multiSelect>
                <!-- 加载更多或者没有了 -->
                <div class="d-clear ac mt10 mb20" v-if="buildingPage.loaded">
                    <el-button
                        @click="getBuildingList()"
                        v-if="!buildingPage.nomore"
                        type="info"
                        size="mini"
                        :loading="buildingPage.isLoading"
                    >加载更多
                    </el-button>
                    <span v-if="buildingPage.nomore" class="d-text-qgray">没有更多了</span>
                </div>
            </el-col>
        </el-row>
        <!-- 楼盘卡片容器结束 -->
        <div v-if="buildingList.length>0">
            <el-checkbox
                v-model="isChooseAllBuilding"
                :indeterminate="(selectedBuildingIds.length&&selectedBuildingIds.length!=buildingList.length)?true:false"
                @change="chooseAllChange"
            >全选
            </el-checkbox>
        </div>
    </div>
</template>
<script>
    import dutyFilter from './duty-filter'; // 引入合同楼盘过滤
    import buildingCard from './duty-buildingcard'; // 楼盘信息卡片
    import multiSelect from './duty-multiselect'; // 排列卡片多选

    export default {
        components: {
            dutyFilter,
            buildingCard,
            multiSelect
        },
        data() {
            return {
                isChooseAllBuilding: false, // 全选楼盘
                maxSelect: 5, // 楼盘最多选择多少个
                // 过滤条件
                queryForm: {
                    assignmentStatus: 0, // 分配状态
                    administrativeId: '', // 行政区域
                    businessCircleId: '', // 商圈
                    communityName: '' // 楼盘名
                },
                buildingList: [], // 楼盘列表
                buildingCount: 0, // 楼盘总数
                selectedBuildingIds: [], // 已选择楼盘 ids
                buildingPage: {
                    isLoading: false, // 是否正在加载
                    loaded: false, // 是否加载过了
                    page: 1, // 分页下一个页码
                    limit: 20, // 每页数据量
                    nomore: false // 加载完毕
                },
                assignmentStatusList: [
                    {name: '未分配', value: 1},
                    {name: '分配中', value: 2},
                    {name: '已分配', value: 3}
                ]
            }
        },

        computed: {},
        props: ['authStatKey'],
        created() {
            this.authStatKey.ready && this.getBuildingList(1)
        },
        mounted() {
        },
        watch: {
            authStatKey(value) {
                value.ready && this.getBuildingList(1)
            },

            selectedBuildingIds(value) {
                this.$emit('update:value', value)
            }
        },
        methods: {
            /**获取楼盘列表 */
            async getBuildingList(page) {
                this.buildingPage.isLoading = true;
                try {
                    if (page) {
                        this.buildingPage.page = page;
                    }
                    let {
                        data: list,
                        count
                    } = await this.$api.seeContractDutyService.getCfgBuildingList(
                        Object.assign(
                            {
                                page: this.buildingPage.page,
                                limit: this.buildingPage.limit,
                                syscode: this.authStatKey.syscode,
                                objauthCode: this.authStatKey.objauthCode,
                                subFuncCodeList: this.authStatKey.subFuncCodeList.filter((item) => !item.endsWith('_copyto'))
                            },
                            this.queryForm
                        )
                    );
                    this.buildingCount = count;
                    this.buildingPage.loaded = true;
                    // 如果是首页，直接赋值
                    // 如果是分页，合并
                    if (this.buildingPage.page == 1) {
                        this.buildingList = list;
                        this.selectedBuildingIds = [];
                        this.isChooseAllBuilding = false;
                        this.dutyList = {};
                    } else {
                        this.buildingList = [].concat(this.buildingList, list);
                    }
                    if (this.buildingPage.page * this.buildingPage.limit >= count) {
                        this.buildingPage.nomore = true;
                    } else {
                        this.buildingPage.nomore = false;
                        this.buildingPage.page = this.buildingPage.page + 1;
                    }
                } catch (e) {
                    console.error(e)
                }
                this.buildingPage.isLoading = false;
            },
            resetAssignmentList() {
                let list = [
                    {name: '未分配', value: 1},
                    {name: '分配中', value: 2},
                    {name: '已分配', value: 3}
                ];
                if (
                    this.authStatKey.subFuncCodeList.length == 1 &&
                    !this.authStatKey.isFlow
                ) {
                    list.splice(1, 1);
                }
                this.assignmentStatusList = list;
                this.queryForm.assignmentStatus = 0;
            },
            filter() {
                // 过滤楼盘
                this.getBuildingList(1);
            },
            maxError(err) {
                if (err == 'maxError') {
                    this.$message.warning({
                        message: `楼盘最多选择${this.maxSelect}个`
                    });
                }
            },
            buildingChanged(ids, buildings) {
                // 及时同步选择状态
                if (ids.length) {
                    this.isChooseAllBuilding = true;
                } else {
                    this.isChooseAllBuilding = false;
                }
            },
            async chooseAllChange() {
                if (this.isChooseAllBuilding) {
                    // 根据最多选择数this.maxSelect和优先未分配原则进行全选
                    // assignmentStatus: 分配状态: 0 全部 1 未分配  2 分配中  3 已分配
                    let choose = [[], [], []];
                    this.buildingList.map(item => {
                        switch (item.assignmentStatus) {
                            case 1:
                                choose[0].push(item);
                                break;
                            case 2:
                                choose[1].push(item);
                                break;
                            case 3:
                                choose[2].push(item);
                                break;
                        }
                    });
                    let ids = []
                        .concat(choose[0], choose[1], choose[2])
                        .splice(0, this.maxSelect)
                        .map(item => item.id);
                    for (let i = 0; i < ids.length; i++) {
                        await this.getAuthDutyUserList([ids[i]]);
                    }
                    this.selectedBuildingIds = ids;
                } else {
                    this.selectedBuildingIds = [];
                }
            },
            initSubSetDialogMeta(subDialogMeta) {
                subDialogMeta.objectNames = this.buildingList
                    .filter(item => this.selectedBuildingIds.includes(item.id))
                    .map(item => item.communityName);
            }
        }
    };
</script>
<style lang="scss" scoped>
    /deep/ .el-radio-button .el-radio-button__inner {
        background-color: #fff;
    }

    /deep/ .contract-filter {
        top: 4px !important;
        right: 4px !important;
    }

    .dutycard {
        border-bottom: 1px dashed #ededed;
        .setting {
            cursor: pointer;
        }
        /deep/ .task-person.d-pointer {
            cursor: default;
        }
        .duty-list {
            min-height: 92px;
        }
    }
</style>
