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
    <div v-loading="isLoading">
        <div class="tabs-filter">
            <!-- 责任流程tabs -->
            <el-tabs v-model="dutyType" @tab-click="tabHandle">
                <el-tab-pane
                    v-for="item of pageAuth"
                    :key="item.objauthName"
                    :label="item.objauthName"
                    :name="item.objauthName"
                ></el-tab-pane>
            </el-tabs>
        </div>
        <el-row class="d-flex hfull mt20">
            <el-col :span="11" class="d-bg-gray hfull">
                <div class="d-bg-gray wfull p15" style="min-height: 680px;border-radius: 5px;">
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
                    <el-row class="d-bg-white h600 mt20 d-auto-y">
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
                                >加载更多</el-button>
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
                        >全选</el-checkbox>
                    </div>
                </div>
            </el-col>
            <el-col :span="12" :offset="1" class="d-bg-gray hfull">
                <div class="d-bg-gray p15" style="min-height: 680px;border-radius: 5px;">
                    <el-row type="flex" align="middle">
                        <el-col :span="24">
                            <i class="el-icon-share"></i>
                            <span>权限信息</span>
                        </el-col>
                    </el-row>
                    <!-- 责任人卡片容器 -->
                    <el-row class="d-bg-white h600 mt20 d-auto-y">
                        <el-col :span="24">
                            <div
                                class="dutycard mr20 ml20 pt20"
                                v-for="item of pageAuthChildren"
                                :key="item.objauthCode"
                            >
                                <el-row>
                                    <el-col>
                                        <span class="fl d-pointer">{{item.objauthName}}</span>
                                        <span
                                            class="setting fr d-text-blue"
                                            @click="setting(item)"
                                            v-if="authorityButtons.includes(item.setauthCode)"
                                        >设置</span>
                                    </el-col>
                                    <el-col class="duty-list">
                                        <!-- <peopleCard :user="fakePeople" v-if="!dutyList[item.objauthName]"></peopleCard> -->
                                        <span v-if="!dutyList[item.objauthCode]"></span>
                                        <peopleCard
                                            v-else
                                            v-for="item of dutyList[item.objauthCode]"
                                            :user="item.empobj"
                                            :key="item.empobj.userId"
                                        ></peopleCard>
                                    </el-col>
                                </el-row>
                            </div>
                        </el-col>
                    </el-row>
                    <!-- 责任人卡片容器结束 -->
                </div>
            </el-col>
        </el-row>

        <!-- dialog弹出框 -->
        <components
            v-if="subDialogMeta.visible"
            :dialogMeta="subDialogMeta"
            :is="subDialogMeta.component"
            @submit="afterSetting"
            @close="closeSubDialog"
        ></components>
    </div>
</template>
<script>
import dutyFilter from './duty-filter'; // 引入合同楼盘过滤
import multiSelect from './duty-multiselect'; // 排列卡片多选
import peopleCard from './duty-peoplecard'; // 责任人卡片
import buildingCard from './duty-buildingcard'; // 楼盘信息卡片
import choosePeople from './duty-chooseduty'; // 选择责任人弹框

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
export default {
    components: {
        dutyFilter,
        multiSelect,
        buildingCard,
        choosePeople,
        peopleCard
    },
    props: ['dialogMeta'],
    data() {
        return {
            isChooseAllBuilding: false, // 全选楼盘
            maxSelect: 5, // 楼盘最多选择多少个
            isLoading: false, // 加载中
            dutyType: '', // 责任设置流程类型，最上tab选项
            selectedAuthTabData: {}, // 已选择责任流程
            pageAuth: [], // 责任流程
            pageAuthChildren: [], // 责任类型，在每一个责任流程的children中
            syscode: '', // 系统编码
            pageCode: '', // 页面编码
            module: '', // 所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
            // 过滤条件
            queryForm: {
                assignmentStatus: 0, // 分配状态
                administrativeId: '', // 行政区域
                businessCircleId: '', // 商圈
                communityName: '' // 楼盘名
            },
            dutyList: {}, // 责任人列表
            // 责任人默认空
            fakePeople: {
                userId: '',
                employeeName: '责任人+'
            },
            buildingDutySetting: {}, //楼盘责任人设置，缓存各个楼盘责任人设置列表
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
            subDialogMeta: {
                component: 'choosePeople',
                visible: false, // 显示子弹框
                isMulti: false, // 是否开启多选
                syscode: '', // 系统编码
                funcCode: '', // 权限码
                funcDesc: '', // 权限码名称
                objectIds: [], // 已选择的楼盘ids
                objectNames: [], // 已选择的楼盘名字
                userIds: [], // 已设置用户ids
                title: '' // 弹框标题
            },
            assignmentStatusList: [
                { name: '未分配', value: 1 },
                { name: '分配中', value: 2 },
                { name: '已分配', value: 3 }
            ]
        };
    },
    computed: {},
    async created() {
        this.isLoading = true;
        this.getMeta();
        try {
            await this.getPageAuth();
        } catch (error) {}
        this.isLoading = false;
    },
    mounted() {},
    watch: {
        dialogMeta() {
            if (this.dialogMeta) {
                this.getMeta();
            }
        }
    },
    methods: {
        getMeta() {
            this.syscode = this.dialogMeta.syscode;
            this.pageCode = this.dialogMeta.pageCode;
            this.module = this.dialogMeta.module;
            if (typeof this.dialogMeta.buildingMaxSelectNum == 'undefined') {
                this.maxSelect = 5;
            } else {
                this.maxSelect =
                    parseInt(this.dialogMeta.buildingMaxSelectNum) || 0;
            }
        },
        /**获取流程责任权限配置信息 */
        async getAuthSettingConfig() {
            if (!window.dutyProgressConfig) {
                let {
                    data
                } = await this.$api.seeHouseConfigService.getHouseTypeConfig();
                let config = data.filter(item => item.id == 13);
                window.dutyProgressConfig = {}; //流程责任权限,放在全局环境
                config[0].values.map(item => {
                    let isOpen = item.actualValue == '1' ? true : false;
                    switch (item.id) {
                        case 44:
                            dutyProgressConfig.houseCondition = isOpen;
                            break;
                        case 45:
                            dutyProgressConfig.contract = isOpen;
                            break;
                        case 46:
                            dutyProgressConfig.finance = isOpen;
                            break;
                        case 47:
                            dutyProgressConfig.property = isOpen;
                            break;
                    }
                });
            }
        },
        /**获取页面tab和人员设置列表配置信息 */
        async getPageAuth() {
            await this.getAuthSettingConfig();
            let {
                data
            } = await this.$api.seeContractDutyService.getCfgPageAuth({
                syscode: this.syscode,
                pageCode: this.pageCode
            });
            // module所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
            let isOpenFlow = window.dutyProgressConfig[this.module];
            // 过滤流程
            data = data.filter(
                item => (item.isFlow && isOpenFlow) || !item.isFlow
            );
            this.pageAuth = data;
            if (data[0]) {
                this.pageAuthChildren = data[0].children;
                this.resetAssignmentList();
                this.selectedAuthTabData = data[0];
                this.dutyType = data[0].objauthName;
                await this.getBuildingList(1);
            }
        },
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
                            syscode: this.syscode,
                            objauthCode: this.selectedAuthTabData.objauthCode,
                            subFuncCodeList: this.pageAuthChildren.map(
                                item => item.objauthCode
                            )
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
            } catch (e) {}
            this.buildingPage.isLoading = false;
        },
        resetAssignmentList() {
            let list = [
                { name: '未分配', value: 1 },
                { name: '分配中', value: 2 },
                { name: '已分配', value: 3 }
            ];
            if (
                this.pageAuthChildren.length == 1 &&
                !this.selectedAuthTabData.isFlow
            ) {
                list.splice(1, 1);
            }
            this.assignmentStatusList = list;
            this.queryForm.assignmentStatus = 0;
        },
        // 点击责任流程点击处理函数
        tabHandle(data) {
            this.pageAuth.some(item => {
                if (item.objauthName == data.name) {
                    this.selectedAuthTabData = item;
                    this.pageAuthChildren = item.children;
                    this.resetAssignmentList();
                    this.getBuildingList(1);
                    return true;
                }
            });
        },
        filter() {
            // 过滤楼盘
            this.getBuildingList(1);
        },
        buildingChanged(ids, buildings) {
            // 监听楼盘选择
            this.getAuthDutyUserList(ids);
        },
        /**获取责任人配置列表 */
        async getAuthDutyUserList(ids) {
            let id;
            ids.some(i => {
                let key = `${this.selectedAuthTabData.objauthCode}_${i}`;
                if (!this.buildingDutySetting[key]) {
                    id = i;
                    return true;
                }
            });
            if (id) {
                let key = `${this.selectedAuthTabData.objauthCode}_${id}`;
                if (!this.buildingDutySetting[key]) {
                    if (
                        this.buildingList.filter(item => item.id == id)[0]
                            .assignmentStatus == 1
                    ) {
                        this.buildingDutySetting[key] = [];
                    } else {
                        let {
                            data
                        } = await this.$api.seeContractDutyService.getCfgObjectDataAuthList(
                            {
                                syscode: this.syscode,
                                objectId: id,
                                objectType: 'lp',
                                subFuncCodeList: this.pageAuthChildren.map(
                                    item => item.objauthCode
                                )
                            }
                        );
                        this.buildingDutySetting[key] = data;
                    }
                }
            }
            this.dutyList = {};
            this.checkDutyUserSetting();
        },
        // 检查多个楼盘责任人设置是否一致
        checkDutyUserSetting() {
            let dutyList = {};
            let dutyIdList = {};
            // 生成责任map
            this.pageAuthChildren.map(
                item => (
                    (dutyList[item.objauthCode] = []),
                    (dutyIdList[item.objauthCode] = [])
                )
            );
            // 拆分序列化每栋楼的责任人列表
            let multiDutyList = this.selectedBuildingIds.map((id, index) => {
                let key = `${this.selectedAuthTabData.objauthCode}_${id}`;
                let _dutyList = JSON.parse(JSON.stringify(dutyList));
                let _dutyIdList = JSON.parse(JSON.stringify(dutyIdList));
                this.buildingDutySetting[key].map(item => {
                    if (_dutyList[item.funcCode]) {
                        _dutyList[item.funcCode].push(item);
                        _dutyIdList[item.funcCode].push(item.empobj.userId);
                    }
                });
                return { dutyList: _dutyList, dutyIdList: _dutyIdList };
            });
            if (multiDutyList[0]) {
                dutyList = multiDutyList[0].dutyList;
                dutyIdList = multiDutyList[0].dutyIdList;
            } else {
                dutyList = [];
                dutyIdList = [];
            }
            let diffKeys = []; // 设置不一致的责任人类型
            // 判断每两栋楼的责任人设置是否一致
            multiDutyList.map((now, i) => {
                let next = multiDutyList[i + 1];
                if (next) {
                    return Object.keys(now.dutyList)
                        .filter(key => {
                            // 先通过长度判断
                            if (
                                now.dutyList[key].length !=
                                next.dutyList[key].length
                            ) {
                                return true;
                            }
                            // 求交集
                            let intersection = now.dutyIdList[key].filter(id =>
                                next.dutyIdList[key].includes(id)
                            );
                            if (
                                intersection.length !=
                                now.dutyIdList[key].length
                            ) {
                                return true;
                            }
                            // 求差集
                            let differce = now.dutyIdList[key]
                                .concat(next.dutyIdList[key])
                                .filter(
                                    id =>
                                        !now.dutyIdList[key].includes(id) ||
                                        !next.dutyIdList[key].includes(id)
                                );
                            if (differce.length) {
                                return true;
                            }
                        })
                        .map(key => {
                            // 清除不一致的责任人列表
                            dutyList[key] = [];
                            dutyIdList[key] = [];
                            diffKeys.push(key);
                        });
                }
            });
            // 不一致责任code去重
            diffKeys = Array.from(new Set(diffKeys));
            this.dutyList = dutyList;
            // names含有设置不一致的责任类型
            if (diffKeys.length) {
                this.$message.warning({
                    message: `所选择的楼盘责任权限数据不一致，请重新分配责任人！`
                });
            }
        },
        // 责任人弹框设置点击确认之后
        afterSetting(data) {
            this.selectedBuildingIds.map(id => {
                let key = `${this.selectedAuthTabData.objauthCode}_${id}`;
                delete this.buildingDutySetting[key];
            });
        },
        // 关闭责任人子设置弹框并回填页面
        async closeSubDialog(users) {
            this.subDialogMeta.visible = false;
            if (users) {
                let funcCode = users[0].funcCode;
                this.dutyList[funcCode] = users;
                this.selectedBuildingIds.map(id => {
                    let key = `${this.selectedAuthTabData.objauthCode}_${id}`;
                    this.buildingDutySetting[key] = this.buildingDutySetting[
                        key
                    ]
                        .filter(item => item.funcCode != funcCode)
                        .concat(users);
                    this.checkAssignmentStatusAfterSetting(id);
                });
                this.checkDutyUserSetting();
            }
        },
        /**设置责任人之后，检查一下分配状态 */
        checkAssignmentStatusAfterSetting(id) {
            let key = `${this.selectedAuthTabData.objauthCode}_${id}`;
            let auths = [];
            this.buildingDutySetting[key].map(item => {
                if (item.funcCode && !auths.includes(item.funcCode)) {
                    auths.push(item.funcCode);
                }
            });
            let len = this.pageAuthChildren.filter(
                item => !auths.includes(item.objauthCode)
            ).length;
            this.buildingList.some((item, index) => {
                if (item.id == id) {
                    switch (len) {
                        case 0:
                            item.assignmentStatus = 3; // 已分配
                            break;
                        case this.pageAuthChildren.length:
                            item.assignmentStatus = 1; // 未分配
                            break;
                        default:
                            item.assignmentStatus = 2; // 分配中
                            break;
                    }
                    this.$set(this.buildingList, 0, item);
                }
            });
        },
        // 打开责任人子设置弹框
        setting(item) {
            if (!this.selectedBuildingIds.length) {
                return this.$message.warning({
                    message: '请先选择楼盘'
                });
            }
            let title = [
                this.dialogMeta.parent,
                this.selectedAuthTabData.objauthName,
                `<span class="d-text-blue">[添加${item.objauthName}]</span>`
            ]
                .filter(a => a)
                .join('>');
            this.subDialogMeta.syscode = this.syscode;
            this.subDialogMeta.objectIds = this.selectedBuildingIds;
            this.subDialogMeta.objectNames = this.buildingList
                .filter(item => this.selectedBuildingIds.includes(item.id))
                .map(item => item.communityName);
            this.subDialogMeta.funcCode = item.objauthCode;
            this.subDialogMeta.funcDesc = item.objauthName;
            this.subDialogMeta.userIds = this.dutyList[item.objauthCode].map(
                item => item.empobj.userId
            );
            this.subDialogMeta.title = title;
            this.subDialogMeta.isMulti = true;
            this.subDialogMeta.visible = true;
        },
        // 关闭当前弹框
        close() {
            // component: "contractDuty",
            // visible: true,
            // title: "合同责任人设置"
            this.dialogMeta.visible = false;
        },
        maxError(err) {
            if (err == 'maxError') {
                this.$message.warning({
                    message: `楼盘最多选择${this.maxSelect}个`
                });
            }
        },
        async chooseAllChange() {
            if (this.isChooseAllBuilding) {
                // 根据最多选择数this.maxSelect和优先未分配原则进行全选
                // <!-- assignmentStatus: 分配状态: 0 全部 1 未分配  2 分配中  3 已分配   -->
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
                this.checkDutyUserSetting();
            } else {
                this.selectedBuildingIds = [];
                this.checkDutyUserSetting();
            }
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
