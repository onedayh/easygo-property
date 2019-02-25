<template>
    <div class="remind" v-show="remind">
        <img :src="remind_img" alt="">
        <p>{{remind_text}}</p>
    </div>
</template>

<script>
    import bus from '../assets/js/bus'

    export default {
        data() {
            return {
                remind: false,
                remind_img: '',
                remind_text: '',
                timer: null
            }
        },
        mounted(){
            let _self = this;
            bus.$on('remind', (img, text) => {
                _self.remind = true;
                _self.remind_img = img;
                _self.remind_text = text;
                setTimeout( () => {
                    _self.remind = false;
                },1000)
            });
            bus.$on('loading', () => {
                _self.remind = true;
                _self.remind_img = require('../assets/images/loading.gif');
                _self.remind_text = '加载中...';
            })
            bus.$on('loaded', () => {
                _self.remind = false;
                _self.remind_text = '';
            })
        }
    }
</script>

