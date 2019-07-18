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
              var svg=document.createElementNS('http://www.w3.org/2000/svg','svg')
              svg.viewBox.baseVal.width=1024
              svg.viewBox.baseVal.height=1024
              svg.innerHTML ='<path d="M511.7 907c-6 0-11.8-2.6-15.7-7.1L76.3 425.2c-6.4-7.3-7-17.9-1.5-25.8l189-273.3c3.9-5.7 10.4-9.1 17.3-9.1h462c6.9 0 13.3 3.4 17.3 9.1l189 273.3c5.5 7.9 4.9 18.6-1.5 25.8L527.4 899.9c-4 4.5-9.7 7.1-15.7 7.1zM118.6 409.7l393.1 444.6 393.7-444.6L732 159H292L118.6 409.7z" p-id="1148"></path><path d="M511.6 668.6c-16.1 0-32-6.1-44.1-18.3L326.2 488c-7.6-8.8-6.7-22 2.1-29.7 8.7-7.5 22-6.7 29.6 2.1l140.3 161.3c7.2 7.1 20.5 7.1 28.7-1.1l138.3-159.2c7.6-8.8 20.9-9.6 29.6-2.1 8.8 7.6 9.7 20.9 2.1 29.7L557.5 649.3c-12.9 12.9-29.5 19.3-45.9 19.3z" p-id="1149"></path>'
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