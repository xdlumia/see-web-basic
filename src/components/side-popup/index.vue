<!--公用组件：侧边栏弹出框
/**
* 侧边栏弹出框
* @module 组件存放位置
* @desc 侧边栏弹出框组件
* @author web-王晓冬
* @date 2018年7月6日
* @param {boolean} [sivisible]    - 弹出框是否显示  默认为false
* @param {String} [title]         - 弹出框名title  默认-
* @param {String} [width]         - 弹出框宽度     默认 650px
* @param {Boolean} [modal]        - 是否需要遮罩层     默认 true
* @slot  [header] - sidePopup按钮操作区的内容
* @slot  [body]   - sidePopup的内容
* @example 调用示例
*  <side-popup :visible.sync='visible' title='我的侧边栏' width='800px'>
    //侧边弹出框右侧按钮
    <div slot='header'>
        <el-button type="primary"  size="small">确定</el-button>
        <el-button @click="dialogVisible = false" size="small">取 消</el-button>
    </div>
    //侧边弹出框内容区域
    <div>
        我是内容11
    </div>
  </side-popup>
**/
-->
<template>
  <div>
    <div class="popup-bg" v-if="modal" :class="{active:visible}" @click="hideVisible"></div>
    <div class="popup-main" :class="{active:visible}" :style="{width:width}">
        <div class="popup-head d-bg-gray">
          <div class="d-inline">
            <span class="popup-close el-icon-close" @click="hideVisible" title="关闭"></span>
            <span>{{title}}</span>
          </div>
          <!-- <div class="fr">
            <slot name="header"> -->
              <!-- <el-button type="primary"  size="small">确定</el-button>
              <el-button @click="hideVisible" size="small">取 消</el-button> -->
            <!-- </slot>
          </div> -->
        </div>
        <div class="popup-body">
            <div class="popup-header">
              <slot name="header">
                <!-- <el-button type="primary"  size="small">确定</el-button>
                <el-button @click="hideVisible" size="small">取 消</el-button> -->
              </slot>
            </div>
            <!-- 为了兼容老版本需要添加slot name的问题 -->
            <slot name='body'></slot>
            <slot></slot>
        </div>
    </div>
  </div>
</template>

<script>
  // import {processUrl,bussinessDicUrl} from '@/assets/js/common'
  import axios from 'axios'

  export default {
    name: 'app',
    props:{
      visible:{
        type:Boolean,
        default:false
      },
      title:{
        type:String,
        default:'弹出框'
      },
      width:{
        type:String,
        default:'650px'
      },
      modal:{
        default:false
      }
    },
    data() {
      return { }
    },
    components: {

    },
    created() {
    },
    beforeMount() {

    },
    watch:{
    },
    methods: {
        hideVisible() {
            // 下面的语句配合开头写的 .sync 就会更新父组件中的 visible 变量
            this.$emit('update:visible', false)
        }
    }
  }
</script>
<style>
/*右侧浮层;*/
.popup-bg{position: fixed;z-index: 9; top:0; bottom:0; left:0; right: 0; transition:all .2; background:rgba(0,0,0,0.2);transform:translateX(100%);}
.popup-bg.active{ transform:translateX(0%);}
.popup-main{position: fixed; z-index: 10; transform:translateX(100%); transition:all .2s; top:0px; right: 0;bottom:0px; background: #fff;}
.popup-main.active{transform:translateX(0); box-shadow: 0 7px 21px rgba(0, 0, 0, 0.25); }
.popup-main.full{ top:0; left:0; top:0; width: 100% !important; }
.popup-header{ position: absolute; right:20px; top:13px;}
.popup-head{ line-height: 32px;padding:10px 15px; color: #333;}
.popup-header .popup-header-content{display:inline-block;}
.popup-head .popup-close{ font-size: 18px; cursor: pointer;transition:all .2s; vertical-align: middle }
.popup-head .popup-close:hover{ transform:rotate(90deg); }
.popup-body{overflow-y: auto; padding:10px; height: calc(100vh - 62px); box-sizing: border-box;}
.popup-footer{position: absolute; left:0; right: 0; bottom:0px; padding: 5px 15px; border-top:1px solid #efefef;}
</style>


