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
        <el-row class="d-flex hfull" v-if = 'pageAuth.length'>
            <el-col :span="presetWidth" class="d-bg-gray hfull mr5">
                <el-tabs v-model="categoryType" class="p15" style="min-height: 680px;border-radius: 5px;" v-if = "categories.length > 1">
                    <el-tab-pane
                        v-for="(item, index) of categories"
                        :key="index"
                        :label="item.name"
                        :name="item.type"
                    >
                        <components
                            :is="item.componentName"
                            :value.sync="item.value"
                            :authStatKey="authStatKey"
                            :authStat="innerDataGetter(statCache,selectedAuthTabData.objauthCode, {})[currentCategory.objectType] || {}"
                            :ref="'category' + item.type"
                            style="height: 625px"
                        ></components>
                    </el-tab-pane>
                </el-tabs>
                <div  class="p15"   v-else>
                    <components
                        :is="categories[0].componentName"
                        :value.sync="categories[0].value"
                        :authStat="innerDataGetter(statCache, selectedAuthTabData.objauthCode, {})[currentCategory.objectType] || {}"
                        :authStatKey="authStatKey"
                        ref="categoryRef"
                        style="height: 680px"
                    ></components>
                </div>
            </el-col>
            <el-col :span="24 - presetWidth" class="d-bg-gray hfull ml5">
                <div class="d-bg-gray p15" style="min-height: 680px;border-radius: 5px;">
                    <el-row type="flex" align="middle" style="line-height: 28px;">
                        <el-col :span="24">
                            <i class="el-icon-share"></i>
                            <span>权限信息</span>
                        </el-col>
                    </el-row>
                    <!-- 责任人卡片容器 -->
                    <el-row class="d-bg-white mt10 d-auto-y" style="height: 620px">
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
                                        <peopleCard
                                            v-for="user of currentDutyList[item.objauthCode]"
                                            :user="user.empobj"
                                            :key="user.empobj.userId"
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
            @close="closeSubDialog"
        ></components>
    </div>
</template>
<script>
    import peopleCard from './duty-peoplecard'; // 责任人卡片
    import choosePeople from './duty-chooseduty'; // 选择责任人弹框
    import communityCategory from './category-community';
    import deptCategory from './category-dept';


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
     *
     *
     *
     */
    const categoryConfig = {};
    // 系统默认支持责任人类别：按楼盘进行责任人划分
    let defaultCategory = ['community']

    const dutyDialog = {
        components: {
            choosePeople,
            peopleCard
        },
        props: {
            dialogMeta: {
                type: Object
            },

            supportCategory: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            let categories = (this.supportCategory.length ? this.supportCategory : defaultCategory).map((type) => {
                return {
                    ...categoryConfig[type],
                    value: []
                }
            })
            return {
                categories: categories,
                presetWidth: categories.reduce((width, item) => Math.max(width, item.presetWidth || 0), 0),
                categoryType: categories[0].type,
                isLoading: false, // 加载中
                dutyType: '', // 责任设置流程类型，最上tab选项
                pageAuth: [], // 责任流程
                selectedAuthTabData: {}, // 已选择责任流程
                pageAuthChildren: [], // 责任类型，在每一个责任流程的children中
                syscode: '', // 系统编码
                pageCode: '', // 页面编码
                module: '', // 所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
                dutyListCache: {}, // 责任人列表
                statCache: {},
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
                }
            };
        },
        computed: {
            // 当前所选类别
            currentCategory() {
                return this.categories.filter(item => item.type === this.categoryType)[0];
            },
            // 当前所选类别的缓存责任人数据
            currentCategoryCache() {
                if (!this.selectedAuthTabData.objauthCode) {
                    return {}
                }

                return this.innerDataGetter(this.innerDataGetter(this.dutyListCache, this.selectedAuthTabData.objauthCode, {}), this.currentCategory.objectType, {})
            },
            // 在当前所选类别下，所选对象的责任人数据，按权限码分组
            // 注意：如果选择了多个对象，对责任人数据会进行合并。
            currentDutyList() {
                let currentCategory = this.currentCategory
                let typeCache = this.currentCategoryCache
                let values = currentCategory.value;
                let result = {}

                if (values.length) {
                  let data = typeCache[values[0]]

                  this.pageAuthChildren.forEach((item) => result[item.objauthCode] = data[item.objauthCode] || [])
                  if (values.length > 1) {
                    this.mergeMultipleUserSetting(result, currentCategory, typeCache, values)
                  }
                }

                return result;
            },
            // 用于存储当前选择页签的权限信息，并判断所选页签的信息是否加载完成
            authStatKey() {
                let key = {
                    syscode: this.syscode,
                    objauthCode: this.selectedAuthTabData.objauthCode,
                    isFlow: this.selectedAuthTabData.isFlow,
                    subFuncCodeList: this.pageAuthChildren.map(
                        item => item.objauthCode
                    )
                }

                key.ready = key.syscode && key.objauthCode && key.subFuncCodeList && key.subFuncCodeList.length > 0

                return key;
            },
            // 用于检查当前选择页签、分类的改变
            authStatCategoryUserKey() {
                return this.syscode + this.selectedAuthTabData.objauthCode + this.categoryType + JSON.stringify(this.currentCategory.value)
            }
        },
        watch: {
            dialogMeta() {
                if (this.dialogMeta) {
                    this.getMeta();
                }
            },
            authStatKey(value) {
            },

            authStatCategoryUserKey() {
                this.queryAllAuthStat()
                this.getAllAuthDutyUserList()
            }
        },
        async created() {
            this.isLoading = true;
            this.getMeta();
            try {
                await this.getPageAuth();
            } catch (error) {
            }
            this.isLoading = false;
        },
        mounted() {
        },
        // 注册一个权限分类
        registerDutyCategory(config) {
            if (categoryConfig[config.type]) {
                throw `类型${config.type}已注册`
            }
            Object.assign(this.components, config.components)
            delete  config.components

            categoryConfig[config.type] = config;
        },
        setDefaultCategory(l) {
            defaultCategory = l
        },
        methods: {
            innerDataGetter(obj, key, defaultVal) {
                if (!obj[key]) {
                    this.$set(obj, key, defaultVal)
                }

                return obj[key];
            },
            getMeta() {
                this.syscode = this.dialogMeta.syscode;
                this.pageCode = this.dialogMeta.pageCode;
                this.module = this.dialogMeta.module;
            },
            /**获取流程责任权限配置信息 */
            async getAuthSettingConfig() {
                let {
                    data
                } = await this.$api.seeContractDutyService.queryProcessSet('ifUserDefineProcessAuditor');
                let {content} = data;
                content = JSON.parse(content);
                if (content.switch == "false" || !content.switch) {
                    return false;
                } else {
                    return true;
                }
            },
            // 点击责任流程点击处理函数
            tabHandle(data) {
                this.pageAuth.some(item => {
                    if (item.objauthName == data.name) {
                        this.selectedAuthTabData = item;
                        this.pageAuthChildren = item.children;

                        return true;
                    }
                });
            },

            // 合并多个设置
            mergeMultipleUserSetting(result, currentCategory, typeCache, values) {
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
                let multiDutyList = values.map((id, index) => {
                    let _dutyList = JSON.parse(JSON.stringify(dutyList));
                    if(typeCache[id] ){
                      this.pageAuthChildren.map(
                        item => {
                            if (typeCache[id][item.objauthCode]) {
                                _dutyList[item.objauthCode] = [..._dutyList[item.objauthCode], ...typeCache[id][item.objauthCode]];
                            }
                        });
                        let _dutyIdList = {}

                        this.pageAuthChildren.map(
                          item => (
                            _dutyIdList[item.objauthCode] = _dutyList[item.objauthCode].map(item => item.empobj.userId)
                          )
                        );

                        return { dutyList: _dutyList, dutyIdList: _dutyIdList};
                    }
                }).filter(a=>a);
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
                                    now.dutyList[key].length !==
                                    next.dutyList[key].length
                                ) {
                                    return true;
                                }
                                // 求交集
                                let intersection = now.dutyIdList[key].filter(id =>
                                    next.dutyIdList[key].includes(id)
                                );
                                if (
                                    intersection.length !==
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

                Object.assign(result, dutyList)
                // names含有设置不一致的责任类型
                if (diffKeys.length) {
                    // TODO： 计算属性里提示。不太合适，需要想个办法
                    this.$message.warning({
                        message: `所选择的楼盘责任权限数据不一致，请重新分配责任人！`
                    });
                }
            },

            // 查询每个分类下的已配置数量
            queryAllAuthStat() {
                let objectType = this.currentCategory.objectType
                let currentStatCache = this.innerDataGetter(this.statCache, this.selectedAuthTabData.objauthCode, {})

                if (!currentStatCache[objectType]) {
                    this.$set(currentStatCache, objectType, {})

                    this.$api.seeContractDutyService.statObjDataauthList({
                        syscode: this.syscode,
                        funcCode: this.selectedAuthTabData.objauthCode,
                        objectType: objectType
                    }).then(({data}) => {
                      let obj = {};
                      data.forEach(item => {
                        obj[item.objectId] = item.targetUserCount
                      })
                      this.$set(currentStatCache, objectType, obj)
                    }).catch(() => {
                        delete currentStatCache[objectType]
                    })
                }
            },

            // 当前选择页签、分类改变后，重新加载权限信息。
            // 注意这里优先从缓存查询，查询不到的去后端查询
            getAllAuthDutyUserList() {
                if (this.syscode && this.selectedAuthTabData.objauthCode) {
                    let objectType = this.currentCategory.objectType
                    let values = this.currentCategory.value
                    let typeCache = this.currentCategoryCache


                    Promise.all(values.map(value => {
                        if (!typeCache[value]) {
                            let newCache = {}
                            this.$set(typeCache, value, newCache)
                            return this.$api.seeContractDutyService.getCfgObjectDataAuthList(
                                {
                                    syscode: this.syscode,
                                    objectId: value,
                                    objectType: objectType,
                                    subFuncCodeList: this.pageAuthChildren.map(
                                        item => item.objauthCode
                                    )
                                }
                            ).then((res) => {
                              (res.data || []).forEach((item) => {
                                  this.innerDataGetter(newCache,item.funcCode,[]).push(item)
                                })
                            }).catch(() => {
                                // 失败了就删除缓存，方便下次重新加载
                                delete typeCache[value]

                                return Promise.reject(new Error("加载失败"))
                            });
                        }
                    })).then(() => {
                        // 异步加载，有可能当前页签已经切换了
                        // if (typeCache ===  this.currentCategoryCache) {
                        //     this.currentDutyList = this.getCurrentDutyList()
                        // }
                    })
                }
            },

            /**获取页签和人员设置列表配置信息 */
            async getPageAuth() {
                let isOpenFlow = await this.getAuthSettingConfig();
                let {
                    data
                } = await this.$api.seeContractDutyService.getCfgPageAuth({
                    syscode: this.syscode,
                    pageCode: this.pageCode
                });
                // 过滤流程
                data = data.filter(
                    item => ((item.isFlow && isOpenFlow) || !item.isFlow) && this.authorityButtons.includes(item.objauthCode)
                );
                data.map(auth => {
                    auth.children.sort((a, b) => {
                        return a.sort == b.sort ? 0 : (a.sort < b.sort ? -1 : 1);
                    });
                })
                this.pageAuth = data;
                if (data[0]) {
                    this.dutyType = data[0].objauthName
                    this.pageAuthChildren = data[0].children;
                    this.selectedAuthTabData = data[0];
                }
            },
            // 关闭责任人子设置弹框并回填页面
            async closeSubDialog(users) {
                this.subDialogMeta.visible = false;
                if (users) {
                    let currentValue = this.currentCategory.value
                    let typeCache = this.currentCategoryCache

                    let currentStatCache = this.innerDataGetter(this.statCache, this.selectedAuthTabData.objauthCode, {})[this.currentCategory.objectType]

                    currentValue.forEach(val => {
                       // 责任人设置变化后，缓存统计数量重新计算
                        let lastCount = currentStatCache[val] || 0

                        if(typeCache[val][this.subDialogMeta.funcCode]) {
                          lastCount -= typeCache[val][this.subDialogMeta.funcCode].length
                        }

                        lastCount += users.length;
                        currentStatCache[val] = lastCount

                        this.$set(typeCache[val],this.subDialogMeta.funcCode, users)
                    })
                }
            },
            // 打开责任人子设置弹框
            setting(item) {
                let currentCategory = this.currentCategory;

                if (!currentCategory.value) {
                    return this.$message.warning({
                        message: '请先选择' + currentCategory.name
                    });
                }

                let title = [
                    this.dialogMeta.parent,
                    this.selectedAuthTabData.objauthName,
                    `<span class="d-text-blue">[添加${item.objauthName}]</span>`
                ]
                    .filter(a => a)
                    .join('>');
                this.subDialogMeta.component =  'choosePeople'
                this.subDialogMeta.syscode = this.syscode;
                this.subDialogMeta.objectType = currentCategory.objectType
                this.subDialogMeta.objectIds = currentCategory.value
                this.subDialogMeta.funcCode = item.objauthCode;
                this.subDialogMeta.funcDesc = item.objauthName;
                this.subDialogMeta.userIds = this.currentDutyList[item.objauthCode].map(
                    item => item.empobj.userId
                );
                this.subDialogMeta.title = title;
                this.subDialogMeta.isMulti = true;
                this.subDialogMeta.visible = true;

                let categoryRef = this.categories.length > 1 ? this.$refs['category' + this.categoryType][0] : this.$refs.categoryRef

                categoryRef.initSubSetDialogMeta && categoryRef.initSubSetDialogMeta( this.subDialogMeta)
            },
            // 关闭当前弹框
            close() {
                this.dialogMeta.visible = false;
            }
        }
    };

    dutyDialog.registerDutyCategory(communityCategory)
    dutyDialog.registerDutyCategory(deptCategory)

    export default dutyDialog
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
