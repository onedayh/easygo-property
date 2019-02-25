<template>
    <div id="shoppingList" class="all-white">
        <headers/>
        <div class="fix">
            <div class="container" v-if="done">
                <dl>
                    <dt>
                        <p>{{shoppingList.buyer}}</p>
                        <p>
                            <i>{{shoppingList.shop_name}}</i>
                            <i>{{shoppingList.create_time}}</i>
                        </p>
                    </dt>
                    <dd v-for="(item, index) in shoppingList.order_detail" :key="index">
                        <p>{{item.sku_name}}</p>
                        <p>￥{{item.sell_price}}</p>
                    </dd>
                </dl>
                <div class="total">
                    合计：<i>￥</i><span>{{shoppingList.total_money}}</span>
                </div>
            </div>
        </div>
        <remind/>
        <tips/>
    </div>

</template>

<script>
    import headers from '../components/headers'
    import remind from '../components/remind'
    import tips from '../components/tips'
    import bus from '../assets/js/bus'
    import util from '../util/util'

    export default{
        data(){
            return{
                shoppingList: {},
                done: false
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
            _self.getData(query.o_id, query.shop_id)
        },
        methods: {
            getData(o_id, shop_id){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shop/' + shop_id + '/order/' + o_id).then( res => {
                    let datas = res.data;
                    datas.create_time = util.getLocalTime({
                        data: datas.create_time,
                    })
                    _self.shoppingList = datas;
                    _self.done = true;
                    bus.$emit('loaded');
                }).catch( err => {
                    console.log(err);
                    bus.$emit('remind', util.getError(), '获取数据失败')
                })
            }
        }
    }
</script>
