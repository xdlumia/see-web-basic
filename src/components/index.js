/**
 * @author web-闫超
 * @date 2018年10月18日
  这里的组件是常用组件，直接在VUE中注册，使用时不需要导入
 **/
import dSelect from './d-select';
import dTable from './d-table';
import sidePopup from './side-popup';
import employeesChosen from './employees-chosen';
import employeesSelect from './employees-select';

export default {
  components: {
    dSelect: dSelect,
    dTable: dTable,
    sidePopup: sidePopup,
    employeesSelect: employeesSelect,
    employeesChosen: employeesChosen
  }
};