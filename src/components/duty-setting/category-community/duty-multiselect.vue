<!--控制多选组件
/**
 * 多选组件
 * @author web-赵伦
 * @date 2019年3月22日
 * 入参
 * @param {Array<any>} list 数据列表集合
 * @param {String} identity 主键，唯一键值，id
 * @param {Boolean} multi 是否多选，默认 false
 * @param {Array<identity>} value 已经选中的组合，identity对应的值
 * 事件
 * @event change [<identity>] 已选中的 id 集合
 */
-->
<template>
    <div>
        <div
            v-for="(item,index) of selectList"
            :key="item[identity]+randomKey"
            class="d-relative fl"
            @click="choose(item)"
        >
            <slot
                name="card"
                :item="item"
                :selected="item.$$checked"
                :index="index"
                :preItem="index>0?selectList[index-1]:null"
            ></slot>
        </div>
    </div>
</template>
<script>
/**
 * 多选组件
 * @author web-赵伦
 * @date 2019年3月22日
 * 入参
 * @param {Array<any>} list 数据列表集合
 * @param {String} identity 主键，唯一键值，id
 * @param {Boolean} multi 是否多选，默认 false
 * @param {Number} max 最多选几个，数字，默认不限制
 * @param {Array<identity>} value 已经选中的组合，identity对应的值
 * 事件
 * @event change [<identity>] 已选中的 id 集合
 */
export default {
    model: {
        prop: 'value',
        event: 'change'
    },
    components: {},
    props: ['list', 'identity', 'multi', 'value', 'max'],
    data() {
        return {
            selectList: [], // 列表数据
            randomKey: '0', // 随机字符
            preSelected: [] // 之前选中的
        };
    },
    computed: {
        // 是否多选
        isMulti() {
            return !(
                (!this.multi && typeof this.multi !== 'string') ||
                (typeof this.multi === 'string' && this.multi === 'false')
            );
        }
    },
    created() {
        // 如果有id查询编辑详情
        this.identity = this.identity || 'id';
        this.resetList();
    },
    mounted() {},
    watch: {
        list() {
            this.resetList();
        },
        value() {
            this.resetList();
        }
    },
    methods: {
        //重置选项列表，并赋值 $$checked;
        resetList() {
            this.selectList = JSON.parse(JSON.stringify(this.list || [])).map(
                item => (
                    (item.$$checked = (this.value || []).includes(
                        item[this.identity]
                    )),
                    item
                )
            );
            this.preSelected = this.value;
            this.randomKey = `${Math.random()}`;
        },
        //选中某个选项操作
        choose(item) {
            if (!this.isMulti) {
                this.selectList.map(item => (item.$$checked = false));
            }
            item.$$checked = !item.$$checked;
            // 选中的列表
            let list = this.selectList.filter(item => item.$$checked);
            let max = parseInt(this.max) || 0;
            if (max) {
                if (list.length > max) {
                    item.$$checked = false;
                    return this.$emit('error', 'maxError');
                }
            }
            // 选中的ids
            let ids = list.map(item => item[this.identity]);
            this.$emit('change', ids, this.preSelected || [], list, item);
            this.preSelected = ids;
        }
    }
};
</script>
<style lang="scss"></style>

