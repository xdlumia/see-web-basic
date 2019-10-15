/*
 * @Author: web.王晓冬
 * @Date: 2019-08-01 11:54:35
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-09-30 09:47:17
 * @Description: file content
 */

export default {
  /**自定义拖拽指令
   * @author web-王晓冬
   * @date 2018年7月26日
   * 定义公共js里，在入口文件main.js中import；
   * 给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了
   * v-dialogDrag: 弹窗拖拽+水平方向伸缩
   **/
  directives: {
    /**自定义拖拽指令
   * @author web-王晓冬
   * @date 2019年7月26日
   * 通过自定义v-click判断当前是否有权限
   **/
    // click:{
    //   inserted:function(el,binding,vnode){
    //     // 获取元素code
    //     let code = el.getAttribute('code')
    //     // 获取所有权限码
    //     let authorityButtons = vnode.context.authorityButtons
    //     // 判断当前是否有权限
    //     let isAuth = authorityButtons.includes(code)

    //     let isMarket = vnode.context.isMarket
    //     /**
    //      *  根据isMarket判断当前是否是市场版
    //      * 市场版系统不隐藏按钮dom
    //      */
    //     if(isMarket){
    //         if(isAuth){
    //           // 如果是市场版并且有权限显示按钮和红色图标
    //         }
    //     }else{
    //       // 如果不是市场版还没有权限移除dom
    //       if(!isAuth){
    //         el.remove()
    //       }
    //     }
        
        // 获取自定义指令传过来的方法
    //     let f = typeof binding.value === 'function'?binding.value:binding.value.f
    //     el.addEventListener('click',function(){
    //         if (isAuth) {
    //             alert('需要付费')
    //         } else {
    //             let isArray = binding.value.p && binding.value.p instanceof Array
    //             let params = isArray?binding.value.p:[binding.value.p]
    //             f(...params)
    //         }
    //     },false)
    //   }
    // },
     /**自定义拖拽指令
     * @author web-王晓冬
     * @date 2018年7月26日
     * 定义公共js里，在入口文件main.js中import；
     * 给elementUI的dialog上加上 v-dialogDrag 指令就可以实现弹窗的全屏和拉伸了
     * v-dialogDrag: 弹窗拖拽+水平方向伸缩
     **/
    // dialogDrag begin
    dialogDrag: {
      bind: function bind(el, binding, vnode, oldVnode) {
        //弹框可拉伸最小宽高
        var minWidth = 400;
        var minHeight = 300;
        //初始非全屏
        var isFullScreen = false;
        //当前宽高
        var nowWidth = 0;
        var nowHight = 0;
        //当前顶部高度
        var nowMarginTop = 0;
        //获取弹框头部（这部分可双击全屏）
        var dialogHeaderEl = el.querySelector('.el-dialog__header');
        //弹窗
        var dragDom = el.querySelector('.el-dialog');
        //给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
        dragDom.style.overflow = "auto";
        //清除选择头部文字效果
        dialogHeaderEl.onselectstart = new Function("return false");
        //头部加上可拖动cursor
        dialogHeaderEl.style.cursor = 'move';

        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        var sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

        var moveDown = function moveDown(e) {
          // 鼠标按下，计算当前元素距离可视区的距离
          var disX = e.clientX - dialogHeaderEl.offsetLeft;
          var disY = e.clientY - dialogHeaderEl.offsetTop;

          // 获取到的值带px 正则匹配替换
          var styL = void 0,
              styT = void 0;

          // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
          if (sty.left.includes('%')) {
            styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100);
            styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100);
          } else {
            styL = +sty.left.replace(/\px/g, '');
            styT = +sty.top.replace(/\px/g, '');
          };

          document.onmousemove = function (e) {
            // 通过事件委托，计算移动的距离 
            var l = e.clientX - disX;
            var t = e.clientY - disY;

            // 移动当前元素  
            dragDom.style.left = l + styL + 'px';
            dragDom.style.top = t + styT + 'px';

            //将此时的位置传出去
            //binding.value({x:e.pageX,y:e.pageY})
          };

          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
        dialogHeaderEl.onmousedown = moveDown;
        //双击头部效果
        dialogHeaderEl.ondblclick = function (e) {
          if (isFullScreen == false) {
            nowHight = dragDom.clientHeight;
            nowWidth = dragDom.clientWidth;
            nowMarginTop = dragDom.style.marginTop;
            dragDom.style.left = 0;
            dragDom.style.top = 0;
            dragDom.style.height = "100VH";
            dragDom.style.width = "100VW";
            dragDom.style.marginTop = 0;
            isFullScreen = true;
            dialogHeaderEl.style.cursor = 'initial';
            dialogHeaderEl.onmousedown = null;
          } else {
            dragDom.style.height = "auto";
            dragDom.style.width = nowWidth + 'px';
            dragDom.style.marginTop = nowMarginTop;
            isFullScreen = false;
            dialogHeaderEl.style.cursor = 'move';
            dialogHeaderEl.onmousedown = moveDown;
          }
        };

        //拉伸
        var resizeEl = document.createElement("div");
        dragDom.appendChild(resizeEl);
        //在弹窗右下角加上一个10-10px的控制块
        resizeEl.style.cursor = 'se-resize';
        resizeEl.style.position = 'absolute';
        resizeEl.style.height = '10px';
        resizeEl.style.width = '10px';
        resizeEl.style.right = '0px';
        resizeEl.style.bottom = '0px';
        //鼠标拉伸弹窗
        resizeEl.onmousedown = function (e) {

          // 记录初始x位置
          var clientX = e.clientX;
          // 鼠标按下，计算当前元素距离可视区的距离
          var disX = e.clientX - resizeEl.offsetLeft;
          var disY = e.clientY - resizeEl.offsetTop;

          document.onmousemove = function (e) {
            e.preventDefault(); // 移动时禁用默认事件

            // 通过事件委托，计算移动的距离 
            var x = e.clientX - disX + (e.clientX - clientX); //这里 由于elementUI的dialog控制居中的，所以水平拉伸效果是双倍
            var y = e.clientY - disY;
            //比较是否小于最小宽高
            dragDom.style.width = x > minWidth ? x + 'px' : minWidth + 'px';
            dragDom.style.height = y > minHeight ? y + 'px' : minHeight + 'px';
          };
          //拉伸结束
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          };
        };
      }
    }
    // dialogDrag end

  }
};