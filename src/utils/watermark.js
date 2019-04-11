
/** 前台水印方法
 * @author web-王晓冬
 * @date 2019年04月10日
 *
 *  watermark() 方法
 *  params 0楼盘相册1户型照片2房间照片3证件照片4产证照片5合同预览及下载
 * 1、 水印过滤器表过滤器 给户型照片添加水印
 *  :src="form.watermarkurl | watermark(1)"
 **/

import api from '../api';
import Vue from 'vue';
import { Base64 } from 'js-base64';
let baseURL = window.g.ApiUrl
let OSS = {}

var watermarkCache = {};
var getWatermark = function(watermarkType) {
  var watermark = watermarkCache[watermarkType];

  if (!watermark) {
    Vue.util.defineReactive(watermarkCache, watermarkType, []);
    watermark = watermarkCache[watermarkType];
    var success = false;
    api.seeHouseConfigService.getSinglePicConfig({type:watermarkType})
    .then(function (res) {
      watermarkCache[watermarkType] = res.data || [];
      success = true;
    }).finally(function () {
      // 简单处理下，如果没加载成功，下次重新加载
      !success && delete watermarkCache[watermarkType];
    });
  }
  return watermark;
};
var findWaterConfig = function(currConfig, url,) {
    let watermarkPosition = {
        0:'nw',
        1:'north',
        2:'ne',
        3:'west',
        4:'center',
        5:'east',
        6:'sw',
        7:'south',
        8:'se',
    }
    let imgUrl = url
    let bucketType = OSS.bucket
    // 水印公共
    let config = '?x-oss-process=image/auto-orient,1/quality,q_100/watermark,'
    let bucket = 'bucket_'+bucketType+','
    //  水印文字加密
    let text = `text_${Base64.encodeURI(currConfig.watermarkContent)},`
    // 图片水印
    let imgResize = `${(currConfig.watermarkUrl || '').replace('http://'+bucketType+'.oss-cn-beijing.aliyuncs.com/','')}?x-oss-process=image/resize,P_${currConfig.zoom || 50}`
    let img = `image_${Base64.encodeURI(imgResize)},`
    //   水印文字大小
    let size = `size_${currConfig.fontSize || 14},`
    //   水印位置
    let position = `g_${watermarkPosition[currConfig.watermarkPosition] || ''},`
    // 文字颜色
    let color = `color_${(currConfig.fontColor || '#000000').replace('#','')},`
    // 水平位置
    let x = `x_${currConfig.horizontalMargin || 0},`
    // 垂直位置
    let y = `y_${currConfig.verticalMargin || 0},`
    // 水印透明度
    let t = `t_${currConfig.opacity || 100},`
    // 文字顺时针旋转角度
    let rotate = `rotate_${currConfig.rotationAngle || 0},`
    // 进行水印铺满的效果 0无效
    let fill = `fill_${currConfig.fill || 0}`

    if (currConfig && url && currConfig.watermarkSwitch) {
        if(currConfig.watermarkType==1){
            imgUrl = `${url}${config}${bucket}${text}${size}${position}${color}${x}${y}${t}${rotate}${fill}`
        }else if(currConfig.watermarkType==0){
            imgUrl = `${url}${config}${bucket}${img}${position}${x}${y}${t}`
        }
        
    }
    return imgUrl
};

export default {
  created(){
    let timeStamp = new Date().getTime()
      OSS = this.$local.fetch('OSS')
      if(!OSS || OSS && !OSS.expiration ||  OSS && OSS.expiration && OSS.expiration  <  timeStamp ) {
        // oss不存在 或者 且oss expiration不存在 或者 expartion 小于 timeStamp 重新请求
        this.$api.seeExternService.getOssTicket()
        .then(res => {
            if(res.code == 200) {
                this.$local.save('OSS' , res.data)
                OSS = res.data || {}
            }
        })
      }
  },
  methods: {
  },
  filters: {
    watermark(url, watermarkType) {
        var currWatermarkConfig = getWatermark(watermarkType);
        return findWaterConfig(currWatermarkConfig, url);
    }
  },
};