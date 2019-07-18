<template>
  <el-button
    ref="authButton" 
    :plain="plain"
    :size="size"
    :type="type"
    :disabled="disabled"
    :icon="icon"
    :loading="loading"
    :round="round"
    @click="authClick">
        <slot></slot>
  </el-button>
</template>

<script>
export default {
  name: "app",
  components: {},
  props: {
    code:String,
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
    icon:String,
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
    },
  },
  data() {
    return {
      isMarket: true,
    };
  },
  computed: {
  },
  created() {
  },
  mounted(){
      this.init()
  },
  watch: {
  },
  filters: {

  },
  methods: {
      init(){
        let el = this.$refs.authButton.$el
        // 判断当前是否有权限
        let isAuth = this.authorityButtons.includes(this.code)
        //根据isMarket判断当前是否是市场版
        if(this.isMarket){
            if(isAuth){
               console.log(1)
              // 如果是市场版并且有权限显示按钮和红色图标
              var svg=document.createElement("span");//直接创建
              svg.innerHTML ='12'
              el.insertBefore(svg,el.firstChild)
            }
        }else{
          // 如果不是市场版 &&没有权限移除dom
          if(!isAuth){
            el.remove()
          }
        }
      },
     // 权限按钮事件
      authClick(){
          // 判断当前是否有权限
          let isAuth = this.authorityButtons.includes(this.code)
          if(this.isMarket){
            //   如果是市场版并且有权限执行方法
              if(isAuth){
                this.$emit('auth')  
              }else{
                alert('你没有权限')
              }
          }else{
              this.$emit('auth')  
          }
          
      },
  }
};
</script>
<style scope lang="scss" >

</style>