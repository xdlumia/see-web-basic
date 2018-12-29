import _Object$keys from 'babel-runtime/core-js/object/keys';
import _getIterator from 'babel-runtime/core-js/get-iterator';
/**
 * @desc 公共验证方法
 * @author web-王晓冬
 * @date 2018年9月18号
 * @example 调用示例
 *          :rules="{ type:'phone',message:'请输入正确的手机号'}"
 **/
// 验证正则
import Schema from 'async-validator';

var verify = {
  // 正整数
  positiveNum: function positiveNum(_rule, value, callback) {
    // /^\d+(?=\.{0,1}\d+$|$)/
    var reg = new RegExp('^(0|([1-9][0-9]*))$');
    if (!value|| reg.test(value)) {
      callback();
    } else {
      return callback(new Error("只能是正整数"));
    }
  },
  // 年龄
  age: function age(_rule, value, callback) {
    var reg = new RegExp('^(0|[1-9]|[1-9][0-9]|1[0-1][0-9]|120)$');
    if (!value|| reg.test(value)) {
      callback();
    } else {
      return callback(new Error("只能是0到120的正整数"));
    }
  },

  // 手机号验证
  phone: function phone(_rule, value, callback) {
    var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!value|| reg.test(value)) {
      callback();
    } else {
      return callback(new Error("请输入正确的手机号码"));
    }
  },

  // 用户名验证
  name: function name(_rule, value, callback) {
    var reg = new RegExp('^([\u4E00-\u9FA5]|[a-zA-Z])+$');
    if (!value|| reg.test(value)) {
      callback();
    } else {
      return callback(new Error("只能是中文或者英文！"));
    }
  },
  // 身份证验证
  IDCard: function IDCard(_rule, value, callback) {
    var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    // validateIdCard(value)
    if (value === '' || reg.test(value)) {
      callback();
    } else {
      return callback(new Error('身份证号码不合法'));
    }
  },
  // 判断是否是数字
  number: function number(_rule, value, callback) {
    // /^\d+(?=\.{0,1}\d+$|$)/
    var reg = /^(\+|-)?\d+($|\.\d+$)/;
    if (!value|| reg.test(value)) {
      callback();
    } else {
      return callback(new Error("只能是数字"));
    }
  },
  // 附件校验，所有附件必须上传成功才能提交
  attachment: function attachment(_rule, value, callback) {
    var lock = true;
    value.forEach(function (item) {
      if (item.fileState !== undefined) {
        lock = false;
      }
    });
    if (lock) {
      callback();
    } else {
      return callback(new Error('文件上传中，请稍后'));
    }
  },
  price: function price(_rule, value, callback) {
    var reg = /^((-)?([1-9]\d*(\.\d{1,2})?)|((0)|((-)?0(\.(([1-9][0-9]?)|(0[1-9]))))))$/;
    if (!value || reg.test(value)) {
      callback();
    } else {
      return callback(new Error("金额不合法！"));
    }
  },
  positiveFloat: function positiveFloat(_rule, value, callback) {
    var reg = /^(([1-9]\d*(\.\d{1,2})?)|(0(\.(([1-9][0-9]?)|(0[1-9])))?))$/;
    if (!value|| reg.test(value)) {
      callback();
    } else {
      return callback(new Error("正小数不合法！"));
    }
  },
  bankCard: function bankCard(_rule, value, callback) {
    var reg = /^[a-zA-Z0-9\*]{12,19}$/;
    if (!value || reg.test(value)) {
      callback();
    } else {
      return callback(new Error('请输入12-19位银行卡号'));
    }
  },
  telePhone: function telePhone(_rule, value, callback) {
    if (!value || value.length >= 7 && value.length <= 20) {
      callback();
    } else {
      return callback(new Error("电话不合法"));
    }
  }
};

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = _getIterator(_Object$keys(verify)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var key = _step.value;

    Schema.register(key, verify[key]);
  }

  // export default verify
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}