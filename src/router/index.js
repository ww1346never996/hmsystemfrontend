import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Register from "../views/Register";
import UserInfo from "../views/subpages/UserInfo";
import StorageInfo from "../views/subpages/StorageInfo";
import ManufactureInfo from "../views/subpages/ManufactureInfo";
import StorageOut from "../views/subpages/StorageOut";
import StorageIn from "../views/subpages/StorageIn";
import OrderPage from "../views/subpages/OrderPage";
import AlarmInfo from "../views/subpages/AlarmInfo";
import SystemInfo from "../views/subpages/RationInfo";
import RationInfo from "../views/subpages/RationInfo";

Vue.use(VueRouter)

//通过配置路由来实现页面内菜单栏导航
const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
    hidden:true
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    hidden: true,
  },
  {
    path: '/home',
    name: '首页',
    component: Home,
    hidden: true
  },
  {
    path: '/home',
    name: '信息管理',
    component: Home,
    children:[
      {
        path: '/userInfo',
        name: '用户信息管理',
        component: UserInfo
      },
      {
        path: '/storageInfo',
        name: '库存信息管理',
        component: StorageInfo
      },
      {
        path: '/manufactureInfo',
        name: '供应商信息管理',
        component: ManufactureInfo
      }
    ]
  },
  {
    path: '/home',
    name: '库存管理',
    component: Home,
    children:[
      {
        path: '/StorageOut',
        name: '出库管理',
        component: StorageOut
      },{
        path: '/StorageIn',
        name: '入库管理',
        component: StorageIn
      },
    ]
  },
  {
    path: '/home',
    name: '采购管理',
    component: Home,
    children:[
      {
        path: '/OrderPage',
        name: '采购单管理',
        component: OrderPage
      },
      {
        path: '/AlarmInfo',
        name: '库存预警查看',
        component: AlarmInfo
      },
    ]
  },
  {
    path: '/home',
    name: '配给管理',
    component: Home,
    children:[
      {
        path: '/RationInfo',
        name: '科室配给管理',
        component: RationInfo
      },
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
