<template>
    <div id="billDetail">
        <headers/>
        <div class="fix">
            <div class="mm">
                <p>{{shop_name}} / {{month}}</p>
                <span>{{status == 1 ? '未对账' : '已对账'}}</span>
            </div>
            <dl class="list" style="margin-top: 0">
                <dt>
                    <h6>日期</h6>
                    <h6>营业额</h6>
                </dt>
                <dd v-for="(item, index) in dealData" :key="index">
                    <p>{{item.anly_time}}</p>
                    <p>{{item.total_sales}}</p>
                </dd>
                <div class="total" v-show="done">
                    <p>总营业额：<span>{{mytotal}}</span></p>
                    <p v-if="type == 1">结算金额（含税）：<span>{{atotal}}</span></p>
                    <p v-if="type != 3">分成比例：<span>{{bili}}%</span></p>
                    <p>对账金额（含税）：<span>{{total}}</span></p>
                </div>
            </dl>
            <remind/>
            <tips/>
        </div>
    </div>
</template>

<script>
    import headers from '../components/headers'
    import bus from '../assets/js/bus'
    import remind from '../components/remind'
    import tips from '../components/tips'
    import util from '../util/util'

    export default {
        data() {
            return {
                dealData: [],
                total: 0,
                mytotal: 0,
                bili: '',
                type: null,
                done:false,
                shop_name: '',
                month: '',
                status: ''
            }
        },
        components: {
            headers,
            remind,
            tips
        },
        mounted(){
            let _self = this;
            let query = _self.$route.query;
            _self.shop_name = query.shop_name;
            _self.month = query.month;
            _self.status = query.status;
            _self.getData(query.id)
        },
        methods: {
            getData(id){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shops/reconciliation/' + id + '/detail').then( res => {
                    let datas = res.data, meta = res.meta;
                    datas.forEach(item => {
                        item.anly_time = util.getLocalTime({
                            data: item.anly_time,
                            dataType: 'date'
                        });
                        item.total_sales = parseFloat(item.total_sales).toFixed(2);
                    })
                    _self.type = meta.divide_type;
                    if(meta.divide_type == 1){
                        _self.bili = meta.divide_rate;
                        _self.atotal = meta.settlement;
                    }else if(meta.divide_type == 2){
                        _self.bili = Number(meta.total_sales) <= Number(meta.max_turnover) ? meta.min_rate : meta.max_rate;
                    }
                    _self.total = meta.commission;
                    _self.mytotal = meta.total_sales;
                    _self.dealData = datas;
                    _self.done = true;
                    bus.$emit('loaded')
                }).catch( err => {
                    console.log(err)
                    bus.$emit('remind', util.getError(), '获取数据失败')
                })
            }
        }
    }
</script>

