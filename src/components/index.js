/**
 * @author web-闫超
 * @date 2018年10月19日
  这里的组件是常用组件，直接在VUE中注册，使用时不需要导入
 **/
import dSelect from './d-select';
import dTable from './d-table';
import sidePopup from './side-popup';
import employeesChosen from './employees-chosen';
import employeesSelect from './employees-select';
import viewPic from './view-pic';
import formCard from './form-card';

export default {
  components: {
    dSelect: dSelect,
    dTable: dTable,
    sidePopup: sidePopup,
    employeesSelect: employeesSelect,
    employeesChosen: employeesChosen,
    viewPic: viewPic,
    formCard: formCard,
  }
};