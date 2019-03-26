/**
* @desc 全局配置
* @author web-吴森
* @date 2018年7月10日
**/
import '../assets/css/app.css';
import './verify';

import api from '../api';
import filters from './filters.js';
import local from './localStorage.js';
import dictionary from './dictionary';
import directives from './directives';
import components from '../components';
import buttonAuthority from './button-authority';
import {pickerOptionsMoment,pickerOptionsRange} from './picker-options';
console.log(buttonAuthority)
export default {
  install: function install(vm) {
    vm.prototype.$api = api;
    vm.prototype.$local = local;
    vm.prototype.$pickerOptionsMoment = pickerOptionsMoment;
    vm.prototype.$pickerOptionsRange = pickerOptionsRange;

    vm.mixin(dictionary);
    vm.mixin(directives);
    vm.mixin(components);
    vm.mixin(buttonAuthority);
    vm.mixin({
      filters: filters
    });
  }
};