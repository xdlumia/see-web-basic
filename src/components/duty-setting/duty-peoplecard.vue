<!--
/**
 * @author 赵伦
 * 责任人卡片布局
 * @param {Object} user 用户信息
 * @param {Boolean} selected 是否选中
 */ -->
 <template>
    <div class="d-relative m10 fl" :class="{checked:selected}">
        <div class="d-pointer task-person br d-inline d-text-gray mb10">
            <div class="task-head"></div>
            <div class="task-head-name ac d-bg-yellow">
              <el-avatar v-if="!selected" :src="item.avatarUrl">{{item.employeeName ? item.employeeName.split('').pop() : '无'}}</el-avatar>
              <span v-else>
                    <i class="el-icon-success f18"></i>
                </span>
            </div>
            <div class="pt5 f12" style="width: 50px; margin-left:22px;height:23px;">
                <div class="d-elip d-taskName b" style="width:76px;">{{item.employeeName}}</div>
                <div class="mt10" style="width:76px;">
                    <span
                        class="worker d-bg-blue ac d-inline d-elip fl"
                        style="height: 20px; line-height: 20px; padding:0 3px;"
                        v-if="item.positionName"
                    >{{item.positionName}}</span>
                    <!--<span  class="ac ml5 d-inline d-bg-yellow fl" style="height: 20px; line-height: 20px; padding:0 3px;">借</span>-->
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    props: ['user', 'selected'],
    data() {
        return {
            item: {}
        };
    },
    computed: {},
    created() {
        this.item = this.user || {};
    },
    mounted() {},
    watch: {},
    methods: {}
};
</script>
<style lang="scss" scoped>
.task-person {
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 50px 0 0 50px;
    width: 130px;
    height: 60px;
    border: 1px solid #dcdfe6;
    position: relative;
    border-left: none;
    display: flex;
    background-color: #fff;
    @at-root .checked {
        .task-person {
            background-color: #189eff;
            .worker {
                color: #189eff !important;
                background-color: #fff !important;
            }
            .d-taskName {
                color: #fff;
            }
        }
    }
    .task-head {
        border: 5px solid #189eff;
        float: left;
        border-radius: 50px 0 0 50px;
        width: 28px;
        height: 50px;
        border-right: 0;
    }
    .task-head-name {
        width: 35px;
        height: 35px;
        border-radius: 50%;
        line-height: 35px;
        color: #fff;
        background-color: #189eff;
        position: absolute;
        left: 11px;
        top: 12px;
        border: 1px solid #fff;
    }
}
</style>

