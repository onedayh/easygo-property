<template>
    <div id="shopList">
        <headers/>
        <div class="fix">
            <div class="shopListWrap" v-for="(item, index) in shopList" :key="index">
                <h6>{{item.city}}（{{item.shop.length}}家店）</h6>
                <ul>
                    <router-link tag="li" v-for="(ite, idx) in item.shop" :key="idx" :to="{path: '/share_way', query: {divide: JSON.stringify(ite.divide), name: ite.shop_name}}">
                        <div>
                            <p>{{ite.shop_name}}</p>
                            <!--<span>{{ite.status}}</span>-->
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
    import tips from '../components/tips'
    import bus from '../assets/js/bus'
    import util from '../util/util'

    export default{
        data(){
            return{
                shopList: ''
            }
        },
        components: {
            headers,
            remind,
            tips
        },
        created(){
            // this.getShopList()
        },
        activated(){
            let _self = this;
            if(!_self.$route.meta.isBack){
                _self.getShopList();
                console.log('11')
            }
            _self.$route.meta.isBack = false
        },
        methods: {
            getShopList(){
                let _self = this;
                bus.$emit('loading');
                _self.$ajax.get('/api/v1/property/shops').then( res => {
                    let datas = res.data;
                    let myData = [];
                    for(let key in datas){
                        myData.push({
                            city: key,
                            shop: datas[key]
                        })
                    }
                    _self.shopList = myData;
                    bus.$emit('loaded')
                }).catch( err => {
                    console.log(err)
                    bus.$emit('remind', util.getError(), '获取数据失败')
                })
            }
        }
    }
</script>
