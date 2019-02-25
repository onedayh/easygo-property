<template>
    <div id="headers">
        <h4>{{title}}</h4>
        <i v-show="back" @click="backTo"><img src="../assets/images/back.png" alt=""></i>
        <span v-if="title === '首页'" @click="showSet = !showSet">设置</span>
        <div class="mode-content" @click.self="showSet = false" v-show="showSet && title === '首页'">
            <ul class="more-set">
                <!--<li @click="goPage('/admin_manage')"><p>账号管理</p></li>-->
                <li @click="goPage('/change_password')"><p>修改密码</p></li>
                <li @click="loginOut"><p>退出登录</p></li>
            </ul>
        </div>
    </div>
</template>

<script>
    import router from '../router/index'
    import bus from '../assets/js/bus'

    export default {
        data() {
            return {
                title: '',
                showSet: false,
                back: true
            }
        },
        created(){
            let _self = this;
            if(_self.$route.path === '/index') _self.back = false
        },
        mounted(){
            let _self = this;
            if(_self.$route.path === '/share_way'){
                bus.$on('showTitle', t => {
                    _self.title = t
                })
            }else{
                _self.title = _self.$route.meta.title;
            }
            $('body').css('overflow', 'auto');
        },
        watch: {
            showSet(){
                this.showSet === true ? $('body').css('overflow', 'hidden') : $('body').css('overflow', 'auto')
            }
        },
        methods: {
            //账号管理--修改密码
            goPage(path){
                this.showSet = false;
                router.push({ path: path });
            },
            //退出登录
            loginOut(){
                this.showSet = false;
                bus.$emit('showMode', '确定退出吗？', true)
            },
            //返回上一页
            backTo(){
                router.back(-1)
            }
        }
    }
</script>
