<template>
    <div id="bill">
        <headers/>
        <div class="fix">
            <div class="wrap1">
                <span v-html="display" @click="mode = true"></span>
                <i>|</i>
                <select @change="changeStatus" v-model="status">
                    <option value="">全部状态</option>
                    <option value="1">未对账</option>
                    <option value="2">已对账</option>
                </select>
            </div>
            <dl>
                <dt v-if="billData.length > 0">{{dt}}</dt>
                <router-link tag="dd" v-for="(item, index) in billData" :key="index" :to="{path: '/bill_detail', query: {id: item.reconciliation_id, shop_name: item.shop_name, month: dt, status: item.status}}">
                    <div>
                        <p>{{item.shop_name}}</p>
                        <span :class="{'done': item.status === 1}">{{item.status == 1 ? '未对账' : '已对账'}}</span>
                        <i>{{item.commission}}</i>
                    </div>
                </router-link>
            </dl>
            <div class="emmm" v-if="billData.length == 0 && done">暂无数据</div>
            <transition name="fade">
                <div class="mode" v-show="mode" @click.self="mode = false">
                    <calendar3/>
                </div>
            </transition>
        </div>
        <tips/>
        <remind/>
    </div>
</template>

<script>
    import headers from '../components/headers'
    import calendar3 from '../components/calendar3'
    import util from '../util/util'
    import bus from '../assets/js/bus'
    import tips from '../components/tips'
    import remind from '../components/remind'

    export default{
        data(){
            return {
                billData: [],
                mode:false,
                value: '',
                display: '',
                dt: '',
                count: 0,
                status: '',
                done: false
            }
        },
        components: {
            headers,
            calendar3,
            tips,
            remind
        },
        watch: {
            mode(){
                this.mode ? $('body').css('overflow-y', 'hidden') : $('body').css('overflow-y', 'auto')
            }
        },
        created(){
            let _self = this;
            bus.$on('init', v => {
                _self.value = _self.toValue(v);
                _self.display = _self.toDisplay(v);
                _self.dt = _self.toDt(v);
                _self.getBillData(_self.value)
            })
        },
        mounted(){
            let _self = this;
            //接受日历组件的值
            bus.$on('select', v => {
                _self.value = _self.toValue(v);
                _self.display = _self.toDisplay(v);
                _self.dt = _self.toDt(v);
                _self.getBillData(_self.value);
                _self.mode = false
            })
        },
        activated(){
            let _self = this;
            if(!_self.$route.meta.isBack){
                bus.$on('init', v => {
                    _self.value = _self.toValue(v);
                    _self.display = _self.toDisplay(v);
                    _self.getBillData(_self.value)
                })
            }
            _self.$route.meta.isBack = false
        },
        methods: {
            getBillData(month){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shops/reconciliation/' + month, {
                    params: {
                        status: _self.status
                    }
                }).then( res => {
                    let datas = res.data;
                    _self.billData = datas;
                    _self.done = true;
                    bus.$emit('loaded');
                }).catch( err => {
                    console.log(err);
                    bus.$emit('remind', util.getError(), '获取数据失败');
                })
            },
            toValue(str){
                let value = str.split('-');
                return value[0].toString() + value[1].toString()
            },
            toDisplay(str){
                let display = str.split('-');
                return display[0] + '年' + display[1] + '月'
            },
            toDt(str){
                let dt = str.split('-');
                return dt[0] + '-' + dt[1]
            },
            changeStatus(){
                let _self = this;
                _self.getBillData(_self.value);
            }
        }
    }
</script>
