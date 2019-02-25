<template>
    <div id="index">
        <headers/>
        <div class="fix">
            <div class="wrap">
                <ul class="top">
                    <router-link tag="li" v-for="(item, index) in topData" :key="index" :to="item.route">
                        <img :src="item.img" alt="">
                        <p>{{item.name}}</p>
                    </router-link>
                </ul>
            </div>
            <div class="wrap" style="margin-top: .2rem;">
                <router-link class="tit" tag="h5" to="/shop_list">{{property}}（{{length}}家）</router-link>
                <div class="info">
                    <p>今日营业额</p>
                    <h1>{{todaySale}}</h1>
                </div>
                <div id="echarts" ref="echarts" class="echarts"></div>
            </div>
        </div>
        <remind/>
        <tips/>
    </div>
</template>

<script>
    import headers from '../components/headers'
    import tips from '../components/tips'
    import remind from '../components/remind'
    import echarts from 'echarts'
    import bus from '../assets/js/bus'
    import util from '../util/util'

    export default {
        data() {
            return {
                topData: [
                    { img: require('../assets/images/icon_03.png'), name: '营业额', route: '/income' },
                    { img: require('../assets/images/icon_05.png'), name: '对账单', route: '/bill' },
                    { img: require('../assets/images/icon_07.png'), name: '门店分析', route: '/store_analyse' },
                ],
                option: {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'line',
                            label: {
                                backgroundColor: '#6a7985'
                            },
                            lineStyle:{
                                color:'#60c0bd',
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
                            // type : 'category',
                            boundaryGap : false,
                            data : ['12/11', '12/12', '12/13', '12/14', '12/15', '12/16','12/17'],
                            axisLine: {
                                show: false,
                            },
                            axisLabel:{
                                interval:0,
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
                                // color:'red'
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
                            areaStyle: {
                                normal: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(96,192,189,0.1)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(96,192,189,0.2)'
                                    }])
                                }
                            },
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                    ]
                },
                todayIn: '',    //收入
                todaySale: '',  //营业额
                property: '',   //物业名称
                length: ''      //店铺数量
            }
        },
        components: {
            headers,
            tips,
            remind
        },
        mounted(){
            let _self = this;
            _self.getChartsData();
            _self.getTotalData();
            _self.getLength();
        },
        activated(){
            let _self = this;
            if(!_self.$route.meta.isBack){
                _self.getChartsData();
                _self.getTotalData();
                _self.getLength();
            }
            _self.$route.meta.isBack = false
        },
        methods: {

            //获取图表数据
            getChartsData(){
                let myChart = echarts.init(document.getElementById('echarts'));
                let _self = this;
                let time = util.getRecentSomeDay(7).display.split(' ');
                let start = time[0];
                let end = time[2];
                _self.$ajax.get('/api/v1/property/shops/turnover', {
                    params: {
                        start: start,
                        end: end
                    }
                }).then( res => {
                    let datas = res.data;
                    let myDate = [];
                    let myData = [];
                    for(let key in datas){
                        let time = key.split('-');
                        myDate.push(time[1] + '/' + time[2]);
                        myData.push(parseFloat(datas[key].total_sales).toFixed(2))
                    }
                    _self.option.xAxis[0].data = myDate;
                    _self.option.series[0].data = myData;
                    myChart.setOption(_self.option);
                    window.onresize = function(){
                        myChart.resize()
                    }
                }).catch( err => {
                    console.log(err)
                })
            },
            //获取今日统计数据
            getTotalData(){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shops/turnover/realtime').then( res => {
                    _self.todaySale = res.meta.total_sales.toFixed(2);
                    bus.$emit('loaded');
                })
            },
            getLength(){
                let _self = this;
                _self.$ajax.get('/api/v1/users/info').then( res => {
                    let datas = res.data;
                    this.property = datas.property.property
                })
                _self.$ajax.get('/api/v1/property/shops').then( res => {
                    let datas = res.data;
                    let myData = [];
                    for(let key in datas){
                        let items = datas[key];
                        items.forEach(item => {
                            myData.push(item)
                        })
                    }
                    _self.length = myData.length
                })
            }
        }
    }
</script>
