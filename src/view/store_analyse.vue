<template>
    <div id="storeAnalyse">
        <headers/>
        <div class="fix">
            <div class="wrap1">
                <p @click="selectRecently(7)" :class="{active: recently === 7 }">最近7天</p>
                <i>|</i>
                <p @click="selectRecently(30)" :class="{active: recently === 30 }">最近30天</p>
                <i>|</i>
                <span @click="openCalendar" v-html="calendar.display"></span>
            </div>
            <div class="container">
                <ul class="ul">
                    <li v-for="(item, index) in shopData" :key="index">
                        <div>
                            <p>{{item.shop_name}}</p>
                            <span>{{item.total_sales}}</span>
                            <h3 :class="'a' + index"></h3>
                        </div>
                    </li>
                </ul>
            </div>
            <transition name="fade">
                <div class="calendar-dialog" v-if="calendar.show">
                    <div class="calendar-dialog-mask" @click="closeCalendar"></div>
                    <div class="calendar-dialog-body">
                        <calendar :range="calendar.range" :zero="calendar.zero" :lunar="calendar.lunar" :value="calendar.value"  @select="calendar.select"></calendar>
                    </div>
                </div>
            </transition>
        </div>
        <remind/>
        <tips/>
    </div>
</template>

<script>
    import headers from '../components/headers'
    import calendar from '../components/calendar'
    import util from '../util/util'
    import bus from '../assets/js/bus'
    import remind from '../components/remind'
    import tips from '../components/tips'

    export default{
        data(){
            return {
                a: 0,
                recently: 7,
                calendar:{
                    display:"2018-02-16 <em>至</em> 2019-02-16",
                    show:false,
                    range:true,
                    zero:true,
                    value:[[2018,2,16],[2019,2,16]], //默认日期
                    // lunar:true, //显示农历
                    select:(begin,end)=>{
                        this.calendar.show=false;
                        this.calendar.value=[begin,end];
                        this.calendar.display=begin.join("-")+" <em>至</em> "+end.join("-");
                    }
                },
                shopData: []
            }
        },
        components: {
            headers,
            calendar,
            remind,
            tips
        },
        watch: {
            'calendar.show': function(){
                this.calendar.show === true ? $('body').css('overflow-y', 'hidden') : $('body').css('overflow-y', 'auto')
            },
            'calendar.value': function(){
                let _self = this;
                let value = _self.calendar.display;
                value = value.split(' ');
                _self.getShopData(value[0], value[2]);
                if(_self.a == 1){
                    _self.recently = -1;
                }
                this.a = 1;
            }
        },
        created(){

        },
        mounted(){
            this.initCalendar(7);
        },
        methods: {
             //打开日历
            openCalendar(){
                this.calendar.show=true
            },
            //关闭日历
            closeCalendar(){
                this.calendar.show=false
            },
            //初始化日历和数据
            initCalendar(len){
                let _self = this;
                let dayData = util.getRecentSomeDay(len);
                _self.calendar.value = dayData.value;
                _self.calendar.display = dayData.display;
            },
            //选择最近天数
            selectRecently(recently){
                let _self = this;
                if(_self.recently === recently){
                    return
                }
                _self.recently = recently;
                _self.a = 0;
                _self.initCalendar(recently)
            },
            //计算数据比例
            getBili(){
                let _self = this;
                let count = 0;
                _self.shopData.forEach(item => {
                    count += parseFloat(item.total_sales)
                })
                _self.$nextTick( () => {
                    _self.shopData.forEach((item, index) => {
                        let num = parseFloat((item.total_sales)/count).toFixed(2);
                        $('.a' + index).animate({'width': num * 100 + '%'}, 'linear')
                    })
                })
                bus.$emit('loaded');
            },
            //获取数据
            getShopData(start, end){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shops/analysis',{
                    params: {
                        start: start,
                        end: end
                    }
                }).then( res => {
                    _self.shopData = res.data;
                    _self.getBili();

                }).catch( err => {
                    console.log(err)
                    bus.$emit('remind', util.getError(), '获取数据失败');
                })
            }
        }
    }
</script>
