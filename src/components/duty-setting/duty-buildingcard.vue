<!-- 
/**
 * @author 赵伦
 * 楼盘卡片布局
 * @date 2019/3/25
 * @param {Object} building 楼盘信息
 * @param {Boolean} selected 是否选中
 */ -->
 <template>
    <div class="d-relative m10 fl">
        <!-- assignmentStatus: 分配状态: 0 全部 1 未分配  2 分配中  3 已分配   -->
        <div
            class="building"
            :class="{setted:item.assignmentStatus==3,setting:item.assignmentStatus==2}"
        >
            <el-row type="flex" align="middle">
                <el-col :span="22">
                    <el-row type="flex" align="middle">
                        <el-col :span="6">
                            <span class="logo" :style="{'background-image':item.picUrl}"></span>
                        </el-col>
                        <el-col :span="18">
                            <span class="title">{{item.communityName}}</span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col>
                            <div
                                class="d-text-qgray"
                            >{{item.administrativeName}} / {{item.businessCircleName}}</div>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="2">
                    <span v-if="selected">
                        <i class="el-icon-success d-text-blue"></i>
                    </span>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
export default {
    components: {},
    props: ['building', 'selected'],
    data() {
        return {
            item: {}
        };
    },
    computed: {},
    created() {
        this.item = this.building || {};
    },
    mounted() {},
    watch: {},
    methods: {}
};
</script>
<style lang="scss">
.building {
    padding: 10px;
    width: 160px;
    font-size: 14px;
    border-radius: 5px;
    border: 1px solid #ededed;
    border-left: 4px solid #ccc;
    cursor: pointer;
    &.setted {
        border-left: 4px solid #67c23a;
    }
    &.setting {
        border-left: 4px solid #ff9906;
    }
    .logo {
        display: inline-block;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        width: 30px;
        height: 30px;
        background-image: url('../../assets/img/defaultimg.png');
    }
    .title {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 110px;
    }
}
</style>

