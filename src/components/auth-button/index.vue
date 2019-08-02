<template>
    <span>
        <el-button ref="authButton" :plain="plain" :size="size" :type="type" :disabled="disabled" :icon="icon" :loading="loading" :round="round" @click="authClick">
            <slot></slot>
        </el-button>
        <el-dialog v-dialogDrag title="权限提醒" :visible.sync="authDialog.visible" append-to-body modal-append-to-body top="20px" width="600px" center>
            <div v-if='authPic' style="height: 430px;">
                <img :src="authPic" alt="" class="wfull hfull" />
            </div>
            <span slot="footer" class="ac">
                <el-button size="small" type="danger" @click="openAuthLink">查看详情</el-button>
            </span>
        </el-dialog>
    </span>
</template>

<script>
export default {
    components: {},
    props: {
        code: String, // 权限码
        authPic: String, // 没有权限弹框图片
        authLink: String, // 权限弹框跳转地址
        noAuthIcon: Boolean,// 不显示权限图标，当前只是用于兼容目前不完善的权限判断，后面更新可以考虑删除
        plain: {
            type: Boolean,
            default: false
        },
        type: String,
        size: String,
        disabled: {
            type: Boolean,
            default: false
        },
        icon: String,
        loading: {
            type: Boolean,
            default: false
        },
        circle: {
            type: Boolean,
            default: false
        },
        round: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            authDialog: {
                visible: false
            },
        };
    },
    computed: {},
    created() {},
    mounted() {
        this.init();
    },
    watch: {},
    filters: {},
    methods: {
        init() {
            let el = this.$refs.authButton.$el;
            // 判断当前是否有权限
            let isAuth = this.authorityButtons.includes(this.code);
            //根据isMarket判断当前是否是市场版
            if (this.isMarket) {
                if (isAuth&&!this.noAuthIcon) {
                    // 如果是市场版并且有权限显示按钮和红色图标
                    var svg = document.createElementNS(
                        'http://www.w3.org/2000/svg',
                        'svg'
                    );
                    svg.viewBox.baseVal.width = 900;
                    svg.viewBox.baseVal.height = 900;
                    svg.style.width = '14px';
                    svg.style.height = '13px';
                    svg.innerHTML =
                        '<path fill="#ca0a16" d="M940.8 372.8l-176-219.2c-17.6-22.4-46.4-36.8-75.2-36.8H334.4c-28.8 0-56 12.8-75.2 36.8l-176 219.2C52.8 409.6 56 464 88 499.2l356.8 377.6 4.8 4.8c17.6 16 41.6 25.6 65.6 25.6h3.2c25.6-1.6 49.6-11.2 67.2-30.4l348.8-376c33.6-36.8 35.2-91.2 6.4-128zM888 456L539.2 832c-6.4 6.4-14.4 9.6-22.4 9.6-8 0-16-3.2-22.4-8L136 454.4c-11.2-11.2-11.2-28.8-1.6-41.6l174.4-219.2c6.4-8 16-12.8 25.6-12.8h355.2c9.6 0 19.2 4.8 25.6 12.8l176 219.2c8 12.8 8 30.4-3.2 43.2z" p-id="2065"></path><path fill="#ca0a16" d="M681.6 438.4L515.2 616 344 435.2c-12.8-12.8-32-14.4-46.4-1.6-12.8 11.2-12.8 32-1.6 44.8l172.8 182.4 3.2 3.2c25.6 24 65.6 22.4 91.2-3.2L729.6 480c11.2-12.8 11.2-33.6-1.6-44.8-14.4-11.2-33.6-9.6-46.4 3.2z" p-id="2066"></path>';
                    el.insertBefore(svg, el.firstChild);
                }
            } else {
                // 如果不是市场版 &&没有权限移除dom
                if (!isAuth) {
                    el.remove();
                }
            }
        },
        // 权限按钮事件
        authClick() {
            // 判断当前是否有权限
            let isAuth = this.authorityButtons.includes(this.code);
            if (this.isMarket) {
                //   如果是市场版并且有权限执行方法
                if (isAuth) {
                    this.$emit('authClick');
                } else {
                    this.authDialog.visible=true;
                }
            } else {
                this.$emit('authClick');
            }
        },
        showAuthDialog(){
            this.authDialog.visible=true;
        },
        openAuthLink(){
            if(this.authLink){
                this.$router.push(this.authLink);
            }
        }
    }
};
</script>
<style scope lang="scss" >
</style>