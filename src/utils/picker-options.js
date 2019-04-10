/** 公共日期值
 * @author web-吴森
 * @date 2018年10月31日
 * @desc 日期组件的拓展配置
 * @example
 *        在使用的文件
 *              <el-date-picker
                size="mini"
                class="wfull"
                @change="dateChange"
                v-model="dateRange"
                :picker-options="$pickerOptionsRange"   // $pickerOptionsMoment
                type="datetimerange"
                range-separator="~"
                value-format="timestamp"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
 *
 **/

 /*
    @desc 公共日期的日期范围
    @range  最近三天, 最近一周 , 最近一个月, 最近三个月, 最近半年
    @type  支持的type类型   type="datetimerange"
  */

const pickerOptionsRange = {
  shortcuts: [{
    text: '前三天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
      picker.$emit('pick', [start, end]);
    }
  },{
    text: '前一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '前一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '前三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '前半年',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6);
      picker.$emit('pick', [start, end]);
    }
  }]
}
const dateOptionsAfter = {
  shortcuts: [{
    text: '后三天',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 3);
      picker.$emit('pick', [start, end]);
    }
  },{
    text: '后一周',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
      picker.$emit('pick', [start, end]);
    }
  },{
    text: '后一个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '后三个月',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
      picker.$emit('pick', [start, end]);
    }
  }, {
    text: '后半年',
    onClick(picker) {
      const end = new Date();
      const start = new Date();
      end.setTime(start.getTime() + 3600 * 1000 * 24 * 180);
      picker.$emit('pick', [start, end]);
    }
  }]
}

 /*
    @desc 公共日期的某一时刻
    @range  今天, 昨天, 一周前, 一个月前, 三个月前, 半年前, 今年年底, 明年年底, 后年年底
    @type type支持的类型  type="date"
  */

 const pickerOptionsMoment = {
  shortcuts: [{
    text: '今天',
    onClick(picker) {
      picker.$emit('pick', new Date());
    }
  }, {
    text: '昨天',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24);
      picker.$emit('pick', date);
    }
  }, {
    text: '一周前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit('pick', date);
    }
  },{
    text: '一个月前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit('pick', date);
    }
  },{
    text: '三个月前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 3);
      picker.$emit('pick', date);
    }
  },{
    text: '半年前',
    onClick(picker) {
      const date = new Date();
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 6);
      picker.$emit('pick', date);
    }
  },{
    text: '今年年底',
    onClick(picker) {
      const date = new Date();
      let nowYear = date.getFullYear()
      date.setTime(new Date(nowYear+1,0,-1).getTime());
      picker.$emit('pick', date);
    }
  },{
    text: '明年年底',
    onClick(picker) {
      const date = new Date();
      let nowYear = date.getFullYear()
      date.setTime(new Date(nowYear + 2,0,-1).getTime());
      picker.$emit('pick', date);
    }
  },{
    text: '后年年底',
    onClick(picker) {
      const date = new Date();
      let nowYear = date.getFullYear()
      date.setTime(new Date(nowYear + 3,0,-1).getTime());
      picker.$emit('pick', date);
    }
  }]
}

export {
  pickerOptionsMoment,
  pickerOptionsRange,
  dateOptionsAfter
}
// 全局装入
// export default {
//   install: function (vm) {
//     vm.prototype.$pickerOptionsRange = pickerOptionsRange
//     vm.prototype.$pickerOptionsMoment = pickerOptionsMoment
//   }
// }
