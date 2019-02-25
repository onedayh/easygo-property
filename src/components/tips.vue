<template>
    <div class="mode" v-show="mode">
        <div class="tips">
            <div class="message">
                <span>{{message}}</span>
            </div>
            <div class="button">
                <span @click="yes" :class="[haveCancel ? '' : 'have-cancel']">确认</span>
                <span v-if="haveCancel" @click="mode = false">取消</span>
            </div>
        </div>
    </div>
</template>

<script>
    import bus from '../assets/js/bus'
    import router from '../router/index'

    export default {
        data() {
            return {
                mode: false,
                message: '',
                haveCancel: null,
                haveStyle: {
                    borderRadius: '0 0 8px 8px',
                    width: '100%'
                }
            }
        },
        activated(){
            this.mode = false
        },
        mounted(){
            let _self = this;
            bus.$on('showMode', (msg, havCan) => {
                _self.mode = true;
                _self.message = msg;
                _self.haveCancel = havCan
            })
        },
        methods: {
            yes(){
                let _self = this;
                if(_self.haveCancel){
                    _self.$ajax.delete('/api/v1/auth/logout').then( res => {
                        _self.mode = false;
                        router.replace('/');
                        localStorage.clear()
                    })
                }else{
                    router.replace('/');
                    localStorage.clear()
                }
            }
        }
    }
</script>

