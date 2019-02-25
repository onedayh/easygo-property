<template>
    <div id="login">
        <div class="logo">
            <img src="../assets/images/logo.png" alt="">
            <p>EasyGo<span>|</span>地产物业端</p>
        </div>
        <div class="form-item user-name">
            <input type="text" v-model.trim="userName" placeholder="输入你的邮箱或手机号" @focus="c1 = userName === '' ? false : true; a=0" @blur="c1 = false">
            <i @click="userName = ''" v-show="c1"><img src="../assets/images/cha.png" alt=""></i>
        </div>
        <div class="form-item pass-word">
            <input type="password" v-model="passWord" placeholder="输入你的密码" @focus="c2 = passWord === '' ? false : true" @blur="c2 = false">
            <i @click="passWord = ''" v-show="c2"><img src="../assets/images/cha.png" alt=""></i>
        </div>
        <button @click="login" class="my-btn" type="button">登录</button>
        <remind/>
    </div>
</template>

<script>
    import router from '../router/index'
    import bus from '../assets/js/bus'
    import remind from '../components/remind'
    import sha1 from 'js-sha1'
    import util from '../util/util'

    export default {
        data() {
            return {
                c1: false,
                c2: false,
                userName: '',
                passWord: '',
                a: 0,       //0-userName可watch 1-不行,
            }
        },
        components: {
            remind
        },
        created(){
            let _self = this;
            if(window.localStorage.getItem('loginInfo')){
                router.replace({path:'/index'});
            }
            _self.a = 1;
            if(util.getCookieByName('userName')) _self.userName = util.getCookieByName('userName')
        },
        watch: {
            userName(){
                let _self = this;
                if( _self.a == 0){
                    _self.c1 = _self.userName === '' ? false : true
                }
            },
            passWord(){
                let _self = this;
                _self.c2 = _self.passWord === '' ? false : true
            },
        },
        methods: {
            //登录
            login(){
                let _self = this;
                let email = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-]+)$/;
                let phone = /^1[3|4|5|8][0-9]\d{4,8}$/;
                if(_self.userName === ''){
                    bus.$emit('remind', util.getError(), '请输入账号');
                    return
                }else if(!email.test(_self.userName) && !phone.test(_self.userName) ){
                    bus.$emit('remind', util.getError(), '账号错误');
                    return
                }
                if(_self.passWord === ''){
                    bus.$emit('remind', util.getError(), '请输入密码');
                    return
                }else if(_self.passWord.length <= 5){
                    bus.$emit('remind', util.getError(), '密码太短');
                    return
                }
                bus.$emit('loading');
                _self.$ajax.post('/api/v1/auth/login', {
                    email: _self.userName,
                    password: sha1(_self.passWord)
                }).then( res => {
                    //cookie用户名
                    util.setCookie('userName', _self.userName, 30);
                    //缓存登录信息
                    window.localStorage.setItem('loginInfo', JSON.stringify(res.data));
                    //缓存登录时间
                    window.localStorage.setItem('loginTime', new Date().getTime());
                    //判断能否登录
                    _self.$ajax.get('/api/v1/users/info').then( res => {
                        bus.$emit('loaded');
                        router.replace({ path: '/index' })
                    }).catch( err => {
                        bus.$emit('remind', util.getError(), '登录失败');
                        return
                    })
                }).catch( err => {
                    // if(err.code == 10005){
                    //     bus.$emit('remind', util.getError(), err.message)
                    // }else{
                        bus.$emit('remind', util.getError(), '登录失败')
                    // }   
                })
            }
        }
    }
</script>

