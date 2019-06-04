<template>
    <div>
        <slot></slot>
        <el-dialog
            title="更新提示"
            :visible.sync="versionVisible"
            width="600px">
            <view-pic>
                <div class="version-content mb10">
                    <h3>{{versionData.title}}</h3>
                    <div
                        class="details mt10"
                        v-html="versionData.details || '-'"
                    ></div>
                    <time class="f12">更新时间:{{versionData.updatedDate | timeToStr('YYYY-MM-DD H:mm:ss')}}</time>
                </div>
            </view-pic>
            <div class="ac">
                <el-button
                    type="primary"
                    size="small"
                    @click="versionVisible = false"
                >我知道了</el-button>
            </div>
        </el-dialog>
        <div class="lock-screen lock-screen-bg" v-if="isLockScreen" :class="{active:isLogin}"></div>
        <div class="lock-screen lock-screen-main" v-if="isLockScreen">
            <div class="lock-current-time" :class="{active:isLogin}">
                <time class="lock-time">{{currentTime | timeToStr('hh:mm')}}</time>
                <p class="lock-date">{{currentTime | timeToStr('MM月DD日 dddd')}}</p>
            </div>
            <div class="lock-login-box" :class="{active:isLogin}">
                <div class="login-logo">
                    <slot name="logo"></slot>
                    <p>{{loginForm.account | hidePhone}}</p>
                </div>
                <el-input v-model="encodePassword" ref="loginInput" size="small" type="password" @keyup.native.13="submitLogin()" placeholder="请输入密码"></el-input>
                <span v-if="errotTips" style="color:#fff">{{errotTips}}</span>
                <el-row class="mt10">
                    <el-col :span="12" class="ar">
                        <el-button size="small" style="margin-right:5px" type="primary" @click="submitLogin()">登录</el-button>
                    </el-col>
                    <el-col :span="12" class="al">
                        <el-button size="small" @click="logoutLogin" class="ml5">退出</el-button>
                    </el-col>
                </el-row>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Fingerprint2 from 'fingerprintjs2'
    import moment from 'moment' // 日期格式化
    import { Base64 } from 'js-base64';
    let lockScreenOutTime  = window.g.lockScreenOutTime
    moment.locale('zh-cn')
    export default {
        name: "app",
        components: {},
        data() {
            return {
                loginForm: {
                    account: '',
                    pwd: '',
                    finger: '',
                    from: 1
                },
                versionVisible: false,
                versionData: {
                    title: "", //title
                    updatedDate: "", //更新时间
                    details: "" //详情内容,
                },
                isLockScreen:false, //是否锁屏
                isLogin:false, // 是否登录
                outTime:lockScreenOutTime || 15, // 不操作锁屏时间 /分钟
                currentTime: 0,
                errotTips:'', //登陆错误提示
                timer: null  // 定时器名称
            };
        },
        computed: {
            encodePassword:{
                get (val) {
                    let pwd = ''
                    try{
                        pwd = Base64.decode(this.loginForm.pwd)
                    }
                    catch(err){
                        pwd = ''
                    }
                    return pwd
                },
                set (val) {
                    this.loginForm.pwd = Base64.encode(val)
                }
            }
        },
        created() {
            // 初始化用户信息
            this.initLoginInfo()
            // 版本更新
            this.versionRemind();
            // 监控键盘鼠标
            this.watchMouseKey();
            // 获取当前时间
            this.getCurrentTime()
        },
        beforeMount() {},
        watch: {
            $route() {
                let title = this.$route.meta.title;
                document.title = title;
            },
            isLockScreen(val){
                this.$emit('input',val)
            }
        },
        filters: {
            hidePhone:function(value) {
                if (Number(value) && String(value).length === 11) {
                    var phoneNumber = String(value)
                    var reg = /^(\d{3})\d{4}(\d{4})$/
                    return phoneNumber.replace(reg, '$1****$2')
                } else {
                    return value
                }
            }
        },
        methods: {
            // 获取公司logo
            getCompanyLogo(){
                this.$api.seeBaseinfoService.getCompanyLogo(null,this.$local.fetch("userInfo").syscode)
                .then(res=>{
                    let companyInfo = res.data || {}
                    this.$store.commit('company/companyInfo',companyInfo)
                    this.$local.save('company/companyInfo',companyInfo)
                })
            },
            initLoginInfo(){
                // 读取用户信息
                let userInfo = this.$local.fetch('userInfo')
                this.loginForm.account = userInfo.account
                this.loginForm.syscode = userInfo.syscode
            },
            // 版本更新提醒
            versionRemind() {
                let params = {
                    platformCode: this.$local.fetch("userInfo").syscode
                };
                this.$api.systemService.versionRemind(params).then(res => {
                    if (res.data) {
                        this.versionVisible = true;
                    }
                    this.versionData = res.data || {};
                });
            },
            // 监控键鼠
            watchMouseKey(){
                // 存储当前时间
                localStorage.setItem("lockScreenTime", new Date().getTime());
                this.timer = window.setInterval(()=>{
                    // 获取最新时间 锁屏显示调用
                    this.getCurrentTime()

                    // 获取当前时间戳
                    let currentTime = this.currentTime
                    // 获取上次操作之后存储的时间
                    let localTime = localStorage.lockScreenTime
                    /**
                     * 当(当前时间 - 上次操作的时间)  = 设置的锁屏时间
                     * 并且当前没有锁屏的情况下锁屏
                     */
                    if ((currentTime - localTime) >= this.outTime * 60 * 1000  && !this.isLockScreen) {
                      // 锁屏
                       this.isLockScreen = true
                       //  退出条件触发两秒后再退出登录
                       setTimeout(()=>{
                           localStorage.token = ''
                        //    this.logout()
                       },1000);

                       this.loginForm.pwd = ''
                    }
                    // 如果当前是锁屏并且是登录界面 20秒后无操作后重新锁定
                    if ((currentTime - localTime) >= 20 * 1000 && this.isLockScreen && this.isLogin) {
                      // 锁屏
                       this.isLogin = false
                       this.loginForm.pwd = ''
                    }
                }, 1000);
                //监听鼠标
                document.onclick = () => {
                        //如果操作键盘 重新记录当前时间
                        localStorage.setItem("lockScreenTime", new Date().getTime());
                        // 如果当前是锁屏 并且没有登录框的时候 操作键盘出现登录框
                        this.showLoginBox()
                };
                //监听键盘
                document.onkeydown = () => {
                        //如果操作键盘 重新记录当前时间
                        localStorage.setItem("lockScreenTime", new Date().getTime());
                        // 如果当前是锁屏 并且没有登录框的时候 操作键盘出现登录框
                        this.showLoginBox()

                };
            },
            showLoginBox(){
                if(this.isLockScreen && !this.isLogin){
                    // 显示登录框
                    this.isLogin = true
                }
                if(this.isLockScreen && this.isLogin){
                    try{
                        this.$refs.loginInput.$el.querySelector('input').focus()
                    }
                    catch(err){}
                }
            },
            // 获取当前时间
            getCurrentTime(){
                this.currentTime = new Date().getTime();
            },
            // 重新登录
            submitLogin(){
                this.errotTips = ''
                this.loginForm.finger = localStorage.finger
                this.$api.systemService.login(this.loginForm)
                .then(res=>{
                    let token = res.data.token || ''
                    localStorage.token = token
                    // axios.defaults.headers.token = localStorage.token
                    this.isLogin = false
                    this.isLockScreen = false
                })
                .catch(error=>{
                   this.errotTips = error || ''
                })

            },
            // 退出 暂未使用
            logout(){
                this.$api.systemService.logout()
                .then(res=>{
                    // console.log('退出登录成功')
                })
            },
            // 退出到登录页
            logoutLogin(){
                this.$router.push({ path: '/login' })
            }
        },
        beforeDestroy() {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
</script>
<style scope lang="scss" >
    .version-content .details {
        font-size: 14px;
    }
    .version-content .details img {
        display: inline-block;
        margin-right: 2px;
        width: 240px;
    }
    .lock-screen{
        position:fixed;
        top:0; bottom: 0; left:0; right: 0;
        height: 100%;
    }
    .lock-screen-bg{
        background: url('http://area.sinaapp.com/bingImg/') no-repeat;
        background-size: cover;
        z-index: 9998;
        // visibility: hidden;
        // opacity: 0;
        // transition:.2s;
    }
    // .lock-screen-bg.show{
    //     visibility: visible;
    //     opacity: 1;
    // }
    // .lock-screen-bg.active{
    //     filter: blur(6px);
    // }
    .lock-screen-main{
        background:rgba(0,0,0,.5);
        z-index: 9999;
        text-align: center;
        .lock-current-time{
            top:20%; position:relative;
            .lock-time{ font-size:120px; color:#fff; font-weight: 300; transition:.2s; display: inline-block; line-height: 120px;}
            .lock-date{ font-size:25px; color:#fff; font-weight: 300}; transition:.2s;
        }

        .lock-login-box{
            position: absolute;
            top:20%; bottom:0; left:0; right: 0; width:260px;
            margin: auto; transform: scale(.8,.8);transition:.3s;
            opacity: 0;visibility: hidden;
            filter:bulr(10px);
            .login-logo{
                margin:0 auto;  color:#fff; font-size: 18px;
                p{margin:10px 0 20px 0}
                img{display: inline-block; width:120px; background-color: #fff; height: 120px; border-radius: 50%; object-fit: cover}
            }
        }
    }
    .lock-login-box.active{ transform: scale(1,1); visibility: visible; opacity: 1;}

    .lock-current-time.active{
        top:5%;
        .lock-time{ font-size:45px; line-height: 45px;}
        .lock-date{ font-size:14px;};
        }

</style>



