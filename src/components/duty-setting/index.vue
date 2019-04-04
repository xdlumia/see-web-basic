<!-- 
/**
 * 责任人设置弹框小按钮
 * @author 赵伦
 * 2019/3/26
 * @property {string} title 标题
 * @property {string} parent 父级标题
 * @property {int} size 尺寸,默认16像素
 * @property {string} syscode 系统编码
 * @property {string} pageCode 页面编码
 * @property {string} color 图标颜色
 * @property {number} buildingMaxSelectNum 选择楼盘最多选择多少个，默认5个
 * @property {Enum} module 所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
 */
 -->
 <template>
    <span class="duty-dialog">
        <span
            class="duty-icon"
            @click="dialogMeta.visible=!dialogMeta.visible"
            :style="iconStyle"
            :title="title"
        >
            <svg
                viewBox="0 0 1025 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2798"
                height="128"
                width="128"
            >
                <path
                    d="M292.629467 897.188883l-130.195353 0c13.140905-181.370281 164.906541-324.909163 349.568956-324.909163 43.341143 0 84.868901 7.90849 123.218117 22.355196l39.267166-39.267166c-2.039547-0.902599-4.075001-1.810316-6.132968-2.681191-11.344917-4.798513-22.852547-9.048507-34.5014-12.760217 18.548315-10.670526 35.812318-23.852365 51.349922-39.389968 46.263846-46.263846 71.742322-107.774662 71.742322-173.201859 0-65.427197-25.478477-126.938013-71.742322-173.201859-46.263846-46.263846-107.774662-71.742322-173.201859-71.742322s-126.93699 25.478477-173.200835 71.742322c-46.263846 46.263846-71.742322 107.774662-71.742322 173.201859 0 65.427197 25.478477 126.938013 71.742322 173.201859 15.537603 15.537603 32.801607 28.718419 51.349922 39.389968-11.648853 3.71171-23.156483 7.961704-34.5014 12.760217-47.831626 20.231734-90.784918 49.188595-127.663572 86.068273-36.879678 36.879678-65.837562 79.831946-86.068273 127.664595-20.952176 49.535513-31.574604 102.140068-31.574604 156.352314 0 14.129466 11.453392 25.583882 25.583882 25.583882l156.702302 0c14.13049 0 25.583882-11.454416 25.583882-25.583882S306.758934 897.188883 292.629467 897.188883zM318.226653 327.335539c0-106.848525 86.926868-193.776417 193.776417-193.776417s193.776417 86.927891 193.776417 193.776417-86.927891 193.776417-193.776417 193.776417S318.226653 434.184064 318.226653 327.335539zM882.089276 766.420451c-18.228004-43.095538-43.561164-82.21227-75.36807-116.513093l-36.322973 36.322973c51.762334 56.496375 85.30485 129.945654 91.173793 210.958552l-130.22196 0c-14.129466 0-25.583882 11.454416-25.583882 25.583882s11.454416 25.583882 25.583882 25.583882l156.729932 0c14.129466 0 25.583882-11.454416 25.583882-25.583882C913.66388 868.560519 903.040429 815.955964 882.089276 766.420451zM791.547917 551.013374c-9.992041-9.991018-26.189708-9.991018-36.180726 0l-244.12038 244.12038L404.215104 688.103071c-9.992041-9.991018-26.189708-9.991018-36.180726 0-9.991018 9.991018-9.991018 26.189708 0 36.180726l125.122581 125.121557c4.996021 4.994997 11.542424 7.493007 18.090875 7.493007s13.094854-2.49801 18.090875-7.493007l262.211255-262.211255C801.538934 577.204105 801.538934 561.004391 791.547917 551.013374z"
                    :fill="color||'#000'"
                ></path>
            </svg>
        </span>
        <el-dialog
            :visible.sync="dialogMeta.visible"
            :title="dialogMeta.title"
            :append-to-body="true"
            :close-on-click-modal="false"
            top="20px"
            width="1000px"
            v-dialogDrag
        >
            <!--承租合同修改发票信息为后续追加需求，不能应用下列代码-->
            <components
                :is="dialogMeta.component"
                :dialogMeta="dialogMeta"
                v-if="dialogMeta.visible"
            ></components>
        </el-dialog>
    </span>
</template>
<script>
import contractDuty from './duty-dialog';
/**
 * 责任人设置弹框小按钮
 * @author 赵伦
 * 2019/3/26
 * @property {string} title 标题
 * @property {string} parent 父级标题
 * @property {int} size 尺寸,默认16像素
 * @property {string} syscode 系统编码
 * @property {string} pageCode 页面编码
 * @property {string} color 图标颜色
 * @property {number} buildingMaxSelectNum 选择楼盘最多选择多少个，默认5个
 * @property {Enum} module 所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
 */
export default {
    components: {
        contractDuty
    },
    props: [
        'title', // 标题
        'parent', // 父级标题
        'size', // 尺寸,默认16像素
        'syscode', // 系统编码
        'pageCode', // 页面编码
        'color', // 图标颜色
        'module', // 所属模块 可取值为 houseCondition 房态模块 contract 合同模块 finance 财务模块 property 物业模块
        'buildingMaxSelectNum' // 选择楼盘最多选择多少个
    ],
    data() {
        return {
            dialogMeta: {
                syscode: '', // 系统编码
                pageCode: '', // 页面编码
                component: 'contractDuty', // 组件名
                visible: false, // 是否显示dialog
                title: '', // 标题
                module: '', // 所属模块
                parent: '', // 父级标题
                buildingMaxSelectNum: '' // 选择楼盘最多选择多少个
            }
        };
    },
    computed: {
        iconStyle() {
            let size = this.size || 16;
            let sizepx = `${size}px`;
            return { width: sizepx, height: sizepx };
        }
    },
    created() {
        this.dialogMeta.title = this.title;
        this.dialogMeta.parent = this.parent;
        this.dialogMeta.syscode = this.syscode;
        this.dialogMeta.pageCode = this.pageCode;
        this.dialogMeta.module = this.module;
        this.dialogMeta.buildingMaxSelectNum = this.buildingMaxSelectNum;
    },
    methods: {}
};
</script>
<style lang="scss" scoped>
.duty-dialog {
    &.relative,
    &.d-relative {
        position: relative;
        margin-left: 5px;
        margin-right: 5px;
        right: 0;
        top: 0;
    }
    .duty-icon {
        cursor: pointer;
        display: inline-block;
        width: 16px;
        height: 16px;
        svg {
            width: 100%;
            height: 100%;
        }
    }
}
</style>