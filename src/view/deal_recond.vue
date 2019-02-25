<template>
    <div id="dealRecond">
        <headers/>
        <div class="fix">
            <div class="container">
                <ul>
                    <router-link tag="li" v-for="(item, index) in dealData" :key="index" :to="{path: '/shopping_list', query: {o_id: item.o_id, shop_id: shop_id}}">
                        <div>
                            <p>{{item.buyer}}</p>
                            <p>¥ {{item.total_money}}</p>
                        </div>
                        <div>
                            <span>{{item.shop_name}}</span>
                            <span>{{item.create_time}}</span>
                        </div>
                    </router-link>
                </ul>
            </div>
        </div>
        <remind/>
        <tips/>
    </div>

</template>

<script>
    import headers from '../components/headers'
    import remind from '../components/remind'
    import bus from '../assets/js/bus'
    import util from '../util/util'
    import tips from '../components/tips'

    export default{
        data(){
            return{
                dealData: [],
                shop_id: '',
                time: ''
            }
        },
        components: {
            headers,
            remind,
            tips
        },
        created(){
            let _self = this;
            let query = _self.$route.query;
            _self.shop_id = query.shop_id;
            _self.time = query.time;
            this.getDealData(query.shop_id, query.time)
        },
        activated(){
            let _self = this;
            if(!_self.$route.meta.isBack){
                let query = _self.$route.query;
                _self.shop_id = query.shop_id;
                _self.time = query.time;
                _self.getDealData(_self.shop_id, _self.time);
            }
            _self.$route.meta.isBack = false
        },
        methods: {
            getDealData(shop_id, time){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shop/' + shop_id + '/orders', {
                    params: {
                        start: time,
                        end: time
                    }
                }).then( res => {
                    let datas = res.data;
                    datas.forEach(item => {
                        item.create_time = util.getLocalTime({
                            data: item.create_time,
                            dateType: 'date'
                        })
                    })
                    _self.dealData = res.data;
                    bus.$emit('loaded');
                }).catch( err => {
                    console.log(err);
                    bus.$emit('remind', require('../assets/images/error.png'), '获取数据失败');
                })
            }
        }
    }
</script>
