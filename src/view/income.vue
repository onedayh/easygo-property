<template>
    <div id="income">
        <headers/>
        <div class="fix">
            <div class="wrap1">
                <select v-model="myShop" style="padding-right: .3rem;">
                    <option v-for="(item, index) in shopList" :key="index" :value="item.shop_id">{{item.shop_name}}</option>
                </select>
                <i>|</i>
                <span @click="openCalendar" v-html="calendar.display"></span>
            </div>
            <div class="wrap">
                <div id="echarts" class="echarts" ref="echarts"></div>
            </div>
            <dl class="list">
                <dt>
                    <h6>日期</h6>
                    <h6>营业额</h6>
                    <!--<h6>收入额</h6>-->
                </dt>
                <router-link v-for="(item, index) in dealData" tag="dd" :key="index" :to="{path: '/deal_recond', query: {shop_id: item.shop_id, time: item.anly_time}}">
                    <p>{{item.anly_time}}</p>
                    <p>{{item.total_sales}}</p>
                    <!--<p>{{item.divide}}</p>-->
                </router-link>
                <div class="total">总营业额：<span>{{total}}</span></div>
            </dl>
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
    import echarts from 'echarts'
    import util from '../util/util'
    import bus from '../assets/js/bus'
    import remind from '../components/remind'
    import tips from '../components/tips'

    export default{
        data(){
            return {
                total: '',
                myShop: '',
                shopList: [],
                meta: '',
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
                option: {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',//点击显示类型 line, cross, shadow
                            label: {
                                backgroundColor: '#6a7985'
                            },
                            lineStyle:{
                                color:'#60c0bd'
                            }
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '5%',
                        bottom: '3%',
                        containLabel: true,
                        x: 15,
                        y: 35,
                        x2: 15,
                    },
                    xAxis : [
                        {
                            boundaryGap : false,
                            data : ['12/11', '12/12', '12/13', '12/14', '12/15', '12/16','12/17'],
                            axisLine: {
                                show: false,
                            },
                            axisLabel:{
                                interval:'auto',
                                margin:10,
                                textStyle:{
                                    color:"#aaa"
                                }
                            },
                            axisTick:{
                                show:false
                            },
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value',
                            axisLine: {
                                show: false,
                            },
                            axisTick:{
                                show:false
                            },
                            axisLabel:{
                                textStyle:{
                                    color:"#aaa"
                                }
                            },
                            splitLine:{
                                show:true,
                                lineStyle:{
                                    color:'#eef2f7',
                                }
                            }
                        }
                    ],
                    series : [
                        {
                            name:'营业额',
                            type:'line',
                            stack: '总量',
                            symbol: 'circle',
                            symbolSize:'8',
                            itemStyle: {
                                normal: {
                                    color: 'rgb(96,192,189)'
                                }
                            },
                            areaStyle: {normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgba(96,192,189,0.1)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(96,192,189,0.2)'
                                }])
                            }},
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                    ]
                },
                dealData: []
            }
        },
        components: {
            headers,
            calendar,
            remind,
            tips
        },
        created(){
            let _self = this;
            _self.getShopList();
            _self.initCalendar(7);
        },
        activated(){
            let _self = this;
            if(!_self.$route.meta.isBack){
                _self.getShopList();
                _self.initCalendar(7);
            }
            _self.$route.meta.isBack = false
        },
        watch: {
            'calendar.show': function(){
                this.calendar.show === true ? $('body').css('overflow-y', 'hidden') : $('body').css('overflow-y', 'auto');
            },
            'calendar.value': function(){
                let _self = this;
                let value = _self.calendar.display;
                value = value.split(' ');
                _self.getData(_self.myShop ,value[0], value[2]);
            },
            myShop(){
                let _self = this;
                _self.getData(_self.myShop ,_self.calendar.display.split(' ')[0], _self.calendar.display.split(' ')[2])
            }
        },
        methods: {
            //打开日历
            openCalendar(){
                this.calendar.show=true;
            },
            //关闭日历
            closeCalendar(){
                this.calendar.show=false;
            },
            //获取折线图
            getChartsData(){
                let myChart = echarts.init(document.getElementById('echarts'));
                myChart.setOption(this.option);
                window.onresize = function(){
                    myChart.resize()
                }
            },
            //获取日历
            initCalendar(len){
                let _self = this;
                let dayData = util.getRecentSomeDay(len);
                _self.calendar.value = dayData.value;
                _self.calendar.display = dayData.display;

            },
            //获取店铺列表
            getShopList(){
                let _self = this;
                _self.$ajax.get('/api/v1/property/shops').then( res => {
                    let datas = res.data;
                    let myData = [];
                    for(let key in datas){
                        datas[key].forEach(item => {
                            myData.push(item)
                        })
                    }
                    _self.shopList = myData;
                    _self.myShop = myData[0].shop_id;
                })
            },
            //获取数据
            getData(shop_id, start, end){
                let _self = this;
                if(!shop_id) return;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shop/' + shop_id + '/turnover', {
                    params: {
                        start: start,
                        end: end
                    }
                }).then( res => {
                    let datas = res.data;
                    let picData = [];
                    let dateData = [];
                    let total = 0;
                    datas.forEach(item => {
                        item.anly_time = util.getLocalTime({
                            data: item.anly_time,
                            dataType: 'date'
                        })
                        item.total_sales = parseFloat(item.total_sales).toFixed(2);
                        total = Number(item.total_sales) + total;
                        picData.push(item.total_sales);
                        dateData.push(_self.changeT(item.anly_time));
                    });
                    if(picData.length > 31){
                        picData = picData.slice(0, 31)
                    }
                    picData = picData.reverse();
                    if(dateData.length > 31){
                        dateData = dateData.slice(0, 30)
                    }
                    dateData = dateData.reverse();
                    _self.dealData = res.data.reverse();
                    _self.total = total.toFixed(2);
                    _self.option.xAxis[0].data = dateData;
                    _self.option.series[0].data = picData;
                    _self.getChartsData();
                    bus.$emit('loaded');
                }).catch( err => {
                    console.log(err);
                    bus.$emit('remind', util.getError(), '获取数据失败');
                })
            },
            //转化横坐标时间格式
            changeT(t){
                let n = t.toString();
                n = n.split('-');
                return n[1] + '/' + n[2]
            }
        }
    }
</script>

