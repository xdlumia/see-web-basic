<!--合同筛选组件
/**
* 合同楼盘 筛选
* @author web-赵伦
* @date 2019年3月22日
**/
-->
<template>
    <el-popover
        class="contract-filter row-form-item"
        trigger="manual"
        placement="bottom"
        width="260"
        v-model="filterVisible"
    >
        <el-form
            :model="params"
            class="d-auto-y"
            ref="params"
            label-position="top"
            label-width="100px"
            size="mini"
        >
            <div class="f13 d-text-gray lh30" style="height: 30px;width: 100%;">
                <i class="el-icon-search mr5"></i>楼盘筛选
                <span class="f13 fr d-pointer d-text-blue" @click="clearFilter">清除筛选</span>
            </div>

            <div class="mt5 mb5">
                <el-autocomplete
                    class="wfull"
                    size="mini"
                    placeholder="请输入内容"
                    value-key="communityName"
                    v-model="params.communityName"
                    :fetch-suggestions="handleCommunitySelect"
                    @select="handleCommunitySelect"
                ></el-autocomplete>
            </div>

            <div class="mt15">
                <div class="d-text-gray f13 mt5 mb5">行政区/商圈</div>
                <el-cascader
                    change-on-select
                    class="wfull"
                    size="mini"
                    v-model="selectedOptions"
                    :options="cityOptions"
                    :props="cityProps"
                    @focus="getDistrictList"
                    @change="getBussinessArea"
                ></el-cascader>
            </div>
            <div class="mt15">
                <div class="d-text-gray f13 mt5 mb5">分配状态</div>
                <el-select
                    class="wfull"
                    size="mini"
                    v-model="params.assignmentStatus"
                    placeholder="全部"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.name"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </div>
        </el-form>
        <el-col class="ac mt10">
            <el-button type="primary" size="mini" class="mt10" @click="submitFilter">确定</el-button>
            <el-button size="mini" class="mt10" @click="cancelFilter()">取消</el-button>
        </el-col>
        <span slot="reference" class="d-pointer d-text-gray" @click="openPopover()">
            <i class="el-icon-view"></i> 筛选
        </span>
    </el-popover>
</template>

<script>
export default {
    // params 筛选参数 type 判断当前是已成交还是未成交合同
    props: ['params'],
    data() {
        return {
            cityOptions: [], // 多级选择列表
            cityId: '', // 当前登录用户所在城市id
            cityProps: {
                value: 'id', // 商圈选择id
                label: 'name' // 商圈显示键值
            },
            selectedOptions: [], // 商圈选中双向绑定
            filterVisible: false, // 控制popover显示或者隐藏
            options: [
                // 0 全部 1 未分配  2 分配中  3 已分配
                { name: '全部', value: 0 },
                { name: '已分配', value: 3 },
                { name: '未分配', value: 1 },
                { name: '分配中', value: 2 }
            ],
            /**tmp data临时数据 */
            preparams: {}, // 上次确认时的条件，用于取消按钮
            preid: '' // 多级上次选择时的id
        };
    },
    created() {},
    methods: {
        /**提交筛选 */
        submitFilter() {
            this.filterVisible = false;
            this.$emit('submit', 'success');
        },
        // 清除筛选
        clearFilter() {
            this.$refs.params.resetFields();
            this.params.assignmentStatus = 0;
            this.params.communityName = '';
            this.params.administrativeId = '';
            this.params.businessCircleId = '';
            this.selectedOptions = [];
            this.openPopover();
            this.$emit('submit', 'success');
        },
        /**取消筛选改变 */
        cancelFilter() {
            this.filterVisible = false;
            for (let key in this.params) {
                this.params[key] = this.preparams[key];
            }
        },
        // 自动补全处理
        handleCommunitySelect(text, cb) {
            cb([]);
            // if (text) {
            // } else cb([]);
        },
        // 打开popover
        openPopover() {
            this.preparams = JSON.parse(JSON.stringify(this.params));
            this.filterVisible = !this.filterVisible;
        },
        // 获取行政区域
        async getDistrictList() {
            if (!this.cityOptions.length) {
                this.cityOptions = [];
                this.cityId = this.$local.fetch('cityInfo').id;
                let { data } = await this.$api.seeHouseConfigService.getArea({
                    type: 1,
                    id: this.cityId
                });
                this.cityOptions = data.map(
                    item => ((item.children = []), item)
                );
            }
        },
        // 获取商圈
        async getBussinessArea(ids) {
            let [id] = ids;
            let district = this.cityOptions.filter(item => item.id == id)[0];
            if (ids.length == 2) {
                let bussiness = district.children.filter(
                    item => item.id == ids[1]
                )[0];
                this.params.administrativeId = district.id;
                this.params.businessCircleId = bussiness.id;
            }
            if (id == this.preid) {
                return;
            }
            this.preid = id;
            let { data } = await this.$api.seeHouseConfigService.getBusiness({
                page: 1,
                limit: 1000,
                areaId: id
            });
            district.children = data;
            data.map(item => {
                item.name = item.busName;
                item.id = item.id;
            });
        }
    }
};
</script>

<style scoped>
.contract-filter {
    position: absolute;
    top: 10px;
    right: 10px;
}
</style>
