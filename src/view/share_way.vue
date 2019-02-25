<template>
    <div id="shareWay" class="all-white">
        <headers/>
        <div class="fix">
            <div class="wrap">
                <h6>分成方式</h6>
                <div>
                    <p>{{name}}</p>
                    <p>{{desc}}</p>
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

    export default {
        data() {
            return {
                title: '',
                name: '',
                desc: ''
            }
        },
        components: {
            headers,
            remind,
            tips
        },
        mounted(){
            bus.$emit('showTitle', this.title);
        },
        created(){
            let _self = this;
            bus.$emit('loading');
            _self.title = _self.$route.query.name;
            let divide = _self.$route.query.divide;
            if(divide !== 'null'){
                let obj = JSON.parse(divide);
                switch(obj.divide_type){
                    case 1:
                        _self.name = '固定流水';
                        break;
                    case 2:
                        _self.name = '保底 + 流水';
                        break;
                    case 3:
                        _self.name = '固定租金';
                        break;
                }
                _self.desc = obj.divide_desc
            }else{
                _self.name = '暂未设置分成方式';
                _self.desc = ''
            }
            bus.$emit('loaded');
        }
    }
</script>

