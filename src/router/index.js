import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

import login from '../view/login'
import index from '../view/index'
//账号管理
// import adminManage from '../view/admin_manage'
// import addAdmin from '../view/add_admin'
//修改密码
import changePassword from '../view/change_password'
//收入与流水
import income from '../view/income'
import dealRecond from '../view/deal_recond'
import shoppingList from '../view/shopping_list'
//对账单
import bill from '../view/bill'
import billDetail from '../view/bill_detail'
//门店分析
import storeAnalyse from '../view/store_analyse'
//门店列表
import shopList from '../view/shop_list'
import shareWay from '../view/share_way'

/*
    路由元信息meta:
        title: 页面headers的标题
        keepAlive: 页面是否需要缓存
        isBack: 页面是否有后退动作
*/
const router = new Router({
    routes: [
        {                       //登录
            path: '/',
            name: 'login',
            meta: {
                title: '登录',
                keepAlive: false
            },
            component: login
        },
        {                       //首页
            path: '/index',
            name: 'index',
            meta: {
                title: '首页',
                keepAlive: true,
                isBack: false
            },
            component: index
        },
        /*{                       //账号管理 ---------------------------------------------------------
            path: '/admin_manage',
            name: 'admin_manage',
            meta: {
                title: '账号管理'
            },
            component: adminManage
        },
        {                       //新增账号 && 账号编辑
            path: '/add_admin',
            name: 'add_admin',
            meta: {
                title: '账号管理'
            },
            component: addAdmin
        },*/
        {                       //修改密码--------------------------------------------------------
            path: '/change_password',
            name: 'change_password',
            meta: {
                title: '修改密码',
                keepAlive: false
            },
            component: changePassword
        },
        {                       //收入与流水-----------------------------------------------
            path: '/income',
            name: 'income',
            meta: {
                title: '营业额',
                keepAlive: true,
                isBack: false
            },
            component: income
        },
        {                       //交易记录
            path: '/deal_recond',
            name: 'deal_recond',
            meta: {
                title: '交易记录',
                keepAlive: true,
                isBack: false
            },
            component: dealRecond
        },
        {                       //购物清单
            path: '/shopping_list',
            name: 'shopping_list',
            meta: {
                title: '购物清单',
                keepAlive: false
            },
            component: shoppingList
        },
        {                       //对账单---------------------------------------------------------
            path: '/bill',
            name: 'bill',
            meta: {
                title: '对账单',
                keepAlive: true,
                isBack: false
            },
            component: bill
        },
        {                       //对账单详情
            path: '/bill_detail',
            name: 'bill_detail',
            meta: {
                title: '对账单',
                keepAlive: false
            },
            component: billDetail
        },
        {                       //门店分析-------------------------------------------------------
            path: '/store_analyse',
            name: 'store_analyse',
            meta: {
                title: '门店分析',
                keepAlive: false
            },
            component: storeAnalyse
        },
        {                       //门店列表---------------------------------------------------------
            path: '/shop_list',
            name: 'shop_list',
            meta: {
                title: '门店列表',
                keepAlive: true,
                isBack: false
            },
            component: shopList
        },
        {                       //分成方式
            path: '/share_way',
            name: 'share_way',
            meta: {
                title: '门店列表',
                keepAlive: false
            },
            component: shareWay
        }
    ]
})

router.beforeEach((to, from, next) => {
    let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
    let loginTime = window.localStorage.getItem('loginTime');
    let outTime = Number(loginTime) + 1296000*1000;

    if(// 后退就设置isBack为true
        (  (from.name === 'income' || from.name === 'bill' || from.name === 'store_analyse' || from.name === 'shop_list' || from.name === 'change_password') && to.name === 'index' )
        || (from.name === 'deal_recond' && to.name === 'income')
        || (from.name === 'shopping_list' && to.name === 'deal_recond')
        || (from.name === 'bill_detail' && to.name === 'bill')
        || (from.name === 'share_way' && to.name === 'shop_list')
    ){
        to.meta.isBack = true;
        console.log(to.meta)
    }

    if(to.path != '/' && !loginInfo){
        return next({ path: '/' })

    }else if(to.path != '/' && new Date().getTime() >= outTime){
        window.localStorage.clear();
        bus.$emit('showMode', '登录状态变化，请重新登录', false)
    }
    next()
})

export default router
