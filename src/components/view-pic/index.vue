<!--公共组件：图片预览组件
/**
* 图片预览组件
* @system 组件存放位置
* @desc 图片预览组件
* @author web-王晓冬
* @date 2019年1月17日
**/
-->
<template>
  <div>
    <div @click="viewPriver($event)">
      <slot></slot>
    </div>
    <div class="view-img-bg" :class="{'view-img-in':viewVisible}">
      <div class="viewer-button viewer-close" @click="viewVisible = false">
        <!-- 关闭按钮 -->
        <svg width="100%" height="100%" version="1.1"
            xmlns="http://www.w3.org/2000/svg">
            <line x1="10" y1="10" x2="30" y2="30"
            style="stroke:#fff;stroke-width:1.5"/>
            <line x1="10" y1="30" x2="30" y2="10"
            style="stroke:#fff;stroke-width:1.5"/>
        </svg>
      </div>
      <div class="viewer-content">
        <div class="viewer-box viewer-center" data-feat="bgclose" @click="closeViewer($event)">
          <!-- 上一张 -->
          <div class="viewer-button viewer-prev" @click="viewHandle('prev')">
            <svg width="100%" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <line x1="15" y1="25" x2="30" y2="10"
                style="stroke:#fff;stroke-width:1.5"/>
                <line x1="15" y1="25" x2="30" y2="40"
                style="stroke:#fff;stroke-width:1.5"/>
            </svg>
          </div>
          <!-- 下一张 -->
          <div class="viewer-button viewer-next" @click="viewHandle('next')">
            <svg width="100%" height="100%" version="1.1"
                xmlns="http://www.w3.org/2000/svg">
                <line x1="20" y1="10" x2="35" y2="25"
                style="stroke:#fff;stroke-width:1.5"/>
                <line x1="20" y1="40" x2="35" y2="25"
                style="stroke:#fff;stroke-width:1.5"/>
            </svg>
          </div>
          <img :src="imgCurr.src" :title="imgCurr.title" :alt="imgCurr.title">
        </div>
        <!-- <div class="viewer-toolbar viewer-center">
                     <div class="viewer-toolbar-box">
                         <span>23123</span>
                     </div>
        </div>-->
        <div class="viewer-preview">
          <div class="viewer-preview-box">
            <div
              class="viewer-prview-item"
              v-for="(item,index) of imgSrcList"
              :key="index"
              :class="{'prview-curr':index == imgcurrIndex }"
              @click="viewImgClick(item,index)">
              <img :src="item.src">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      viewVisible: false, //查看图片
      loading: false, // loading动画
      imgCurr: {
        src: "",
        title: ""
      }, //当前图片
      imgSrcList: [],
      imgcurrIndex: 0 //当前图片下标
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 图片点击事件
    viewPriver(e) {
      // 返回其事件监听器触发该事件的元素。
      let currentTarget = e.currentTarget;
      // 返回触发此事件的元素（事件的目标节点）。
      let target = e.target;

      // 获取标签name
      let tagName = target.nodeName.toLowerCase();
      if (tagName !== "img") return;
      let imgArr = currentTarget.querySelectorAll("img");
      this.viewVisible = true;
      // 当前点击图片的下标
      this.imgSrcList = [];
      imgArr.forEach((item, i) => {
        this.imgSrcList.push({
          src: item.src,
          title: item.title || item.alt
        });
        // 获取当前图片的下标
        if (item == target) {
          this.imgcurrIndex = i
        }
      });
      this.imgCurr = this.imgSrcList[this.imgcurrIndex];
    },
    viewHandle(type) {
      if (type == "next") {
        this.imgcurrIndex++;
        if (this.imgcurrIndex > this.imgSrcList.length - 1) {
          this.imgcurrIndex = 0;
        }
      } else if (type == "prev") {
        this.imgcurrIndex--;
        if (this.imgcurrIndex < 0) {
          this.imgcurrIndex = this.imgSrcList.length - 1;
        }
      }
      this.imgCurr = this.imgSrcList[this.imgcurrIndex];
    },
    // 预览图点击事件
    viewImgClick(item, index) {
      this.imgcurrIndex = index;
      this.imgCurr = item;
    },
    // 关闭预览图
    closeViewer(e) {
      if (e.target.dataset.feat == "bgclose") {
        this.viewVisible = false;
      }
    }
  }
};
</script>
<style lang="scss">
.viewer-button {
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  font-size: 12px;
}
.viewer-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.view-img-bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  visibility: hidden;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: all 0.3s;
  z-index: 9999;
}
.view-img-bg.view-img-in {
  visibility: visible;
  opacity: 1;
}
.viewer-close {
  width: 40px;
  height: 40px;
  position: absolute;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  line-height: 40px;
  right: 0px;
  top: 0px;
  border-radius:0;
}
.viewer-content {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
}
.viewer-box {
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
}
.viewer-box .viewer-button {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}
.viewer-box:hover .viewer-button {
  visibility: visible;
  opacity: 1;
}
.viewer-box img {
  display: block;
  max-height: 100%;
  cursor: pointer;
  object-fit: contain;
}
.viewer-box .viewer-prev,
.viewer-box .viewer-next {
  width: 50px;
  text-align: center;
  line-height: 50px;
  height: 50px;
  cursor: pointer;
  position: absolute;
  top: 50%;
  bottom: 50%;
  transform: translateY(-50%);
}
.viewer-box .viewer-prev {
  left: 20%;
}
.viewer-box .viewer-next {
  right: 20%;
}
.viewer-preview {
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  height: 50px;
}
.viewer-preview-box {
  justify-content: center;
  display: inline-block;
  flex: 1 1 0%;
  display: flex;
}
.viewer-prview-item {
  width: 30px;
  opacity: 0.5;
  cursor: pointer;
  height: 50px;
  padding: 0 !important;
  margin: 0 !important;
  margin: 0 1px;
}
.viewer-prview-item.prview-curr {
  opacity: 1;
  border: 3px solid #fff;
  box-sizing: border-box;
}
.viewer-preview img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
