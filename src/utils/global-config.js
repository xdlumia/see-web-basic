/**
* @desc 全局配置
* @author web-吴森
* @date 2018年7月10日
**/
import '../assets/css/app.css';
import './verify';
import './element-extend'

import api from '../api';
import filters from './filters.js';
import local from './localStorage.js';
import dictionary from './dictionary';
import directives from './directives';
import watermark from './watermark';
import components from '../components';
import buttonAuthority from './button-authority';
import {pickerOptionsMoment,pickerOptionsRange,dateOptionsAfter} from './picker-options';


export default {
  install: function install(vm) {
    vm.prototype.$api = api;
    vm.prototype.$local = local;
    vm.prototype.$pickerOptionsMoment = pickerOptionsMoment;
    vm.prototype.$pickerOptionsRange = pickerOptionsRange;
    vm.prototype.$dateOptionsAfter = dateOptionsAfter;

    vm.mixin(dictionary);
    vm.mixin(directives);
    vm.mixin(watermark);
    vm.mixin(components);
    vm.mixin(buttonAuthority);
    vm.mixin({
      filters: filters
    });
  }
};
