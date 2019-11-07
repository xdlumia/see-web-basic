/*
 * @Author: web.王晓冬
 * @Date: 2019-07-12 18:03:58
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-11-07 18:52:15
 * @Description: 全局配置
 */
import '../assets/css/app.css';
import './verify';
import './element-extend'

import api from '../api';
import filters from './filters.js';
import local from './localStorage.js';
import utils from './utils.js';
import dictionary from './dictionary';
import directives from './directives';
import './serversDate';
import watermark from './watermark';
import components from '../components';
import buttonAuthority from './button-authority';
import { pickerOptionsMoment, pickerOptionsRange, dateOptionsAfter } from './picker-options';


export default {
  install: function install(vm) {
    vm.prototype.$api = api;
    vm.prototype.$local = local;
    vm.prototype.$util = utils;
    vm.prototype.$pickerOptionsMoment = pickerOptionsMoment;
    vm.prototype.$pickerOptionsRange = pickerOptionsRange;
    vm.prototype.$dateOptionsAfter = dateOptionsAfter;

    vm.mixin(dictionary.mixin);
    vm.mixin(directives);
    vm.mixin(watermark);
    vm.mixin(components);
    vm.mixin(buttonAuthority);
    vm.mixin({
      filters: filters
    });
  }
};
