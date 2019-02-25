<template>
    <div id="changePassword">
        <headers/>
        <div class="fix">
            <div class="container" style="margin-top:.2rem;">
                <dl class="dl">
                    <dd class="disabled">
                        <span>账号</span>
                        <div style="padding: 0 .3rem;float: left;">{{userName}}</div>
                    </dd>
                    <dd class="pass">
                        <span>旧密码</span>
                        <input type="password" v-model="pass" placeholder="请填写旧密码" @focus="c1 = pass === '' ? false : true" @blur="c1 = false">
                        <i @click="pass = ''" v-show="c1"><img src="../assets/images/cha.png" alt=""></i>
                    </dd>
                    <dd class="pass">
                        <span>新密码</span>
                        <input type="password" v-model="passAgain" placeholder="请填写新密码" @focus="c2 = passAgain === '' ? false : true" @blur="c2 = false">
                        <i @click="passAgain = ''" v-show="c2"><img src="../assets/images/cha.png" alt=""></i>
                    </dd>
                </dl>
            </div>
            <div class="btn-box">
                <button :class="['my-btn', {'no' : ok}]" :disabled="ok" @click="change">完成</button>
            </div>
            <remind/>
            <tips/>
        </div>
    </div>

</template>

<script>
    import headers from '../components/headers'
    import remind from '../components/remind'
    import tips from '../components/tips'
    import bus from '../assets/js/bus'
    import sha1 from 'js-sha1'
    import util from '../util/util'

    export default{
        data(){
            return{
                c1: false,
                c2: false,
                userName: '',
                pass: '',
                passAgain: ''
            }
        },
        components: {
            headers,
            remind,
            tips
        },
        watch: {
            pass(){
                let _self = this;
                _self.pass === '' ? _self.c1 = false : _self.c1 = true
            },
            passAgain(){
                let _self = this;
                _self.passAgain === '' ? _self.c2 = false : _self.c2 = true
            }
        },
        computed: {
            ok(){
                let _self = this;
                if(_self.pass === '' || _self.passAgain === ''){
                    return true
                }
                return false
            }
        },
        mounted(){
            this.get()
        },
        methods: {
            //修改密码
            change(){
                let _self = this;
                if(_self.pass.length < 6){
                    bus.$emit('remind', util.getError(), '旧密码错误');
                    return
                }
                if(_self.passAgain.length < 6){
                    bus.$emit('remind', util.getError(), '新密码太短');
                    return
                }
                _self.$ajax.put('/api/v1/users/resetpassword', {
                    old_password: sha1(_self.pass),
                    password: sha1(_self.passAgain)
                }).then( res => {
                    console.log(res);
                    bus.$emit('showMode', '修改成功,请重新登录。', false)
                }).catch( err => {
                    bus.$emit('remind', util.getError(), '修改密码失败')
                })
            },
            //获取用户名
            get(){
                let _self = this;
                _self.$ajax.get('/api/v1/users/info').then( res => {
                    let datas = res.data;
                    _self.userName = datas.email;
                })
            }
        }
    }
</script>
