import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
//import Free from '@/components/FreeCard'
//import CardSuccess from '@/components/CardSuccess'
const Free = () => import('@/components/FreeCard')
const Business = () => import('@/components/Business')
const Recharge = () => import('@/components/Recharge')
const CardSuccess = () => import('@/components/CardSuccess')
const PaySuccess = () => import('@/components/PaySuccess')
const ChargeSuccess = () => import('@/components/ChargeSuccess')
const Information = () => import('@/components/Information')
const Login = () => import('@/components/Login')
const Company = () => import('@/components/Company')
const ContactUs = () => import('@/components/ContactUs')
const Problem = () => import('@/components/Problem')
const User = () => import('@/components/User')
const CardRecord = () => import('@/components/CardRecord')
const BusinessRecord = () => import('@/components/BusinessRecord')
const RechargeRecord = () => import('@/components/RechargeRecord')
const ImproveSuccess = () => import('@/components/ImproveSuccess')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:"/main"
    },
    {
      path: '*',
      redirect:"/main"
    },
    {
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      path: '/freecard',
      name: 'Free',
      component:Free
    },
    {
      path: '/business',
      name: 'Business',
      component:Business
    },
    {
      path: '/cardsuccess',
      name: 'CardSuccess',
      component:CardSuccess
    },
    {
    	path: '/paysuccess',
      name: 'PaySuccess',
      component:PaySuccess
    },
    {
    	path: '/recharge',
      name: 'Recharge',
      component:Recharge
    },
    {
    	path: '/chargesuccess',
      name: 'ChargeSuccess',
      component:ChargeSuccess
    },
    {
    	path: '/login',
      name: 'Login',
      component:Login
    },
    {
    	path: '/company',
      name: 'Company',
      component:Company
    },
    {
    	path: '/contactus',
      name: 'ContactUs',
      component:ContactUs
    },
    {
    	path: '/problem',
      name: 'Problem',
      component:Problem
    },
    {
    	path: '/information',
      name: 'Information',
      component:Information,
      children:[
           {
				    	path: '/',
				      redirect:"user"
				   },
           {
				    	path: 'user',
				      name: 'User',
				      component:User
				   },
				   {
				    	path: 'cardrecord',
				      name: 'CardRecord',
				      component:CardRecord
				   },
				   {
				    	path: 'businessrecord',
				      name: 'BusinessRecord',
				      component:BusinessRecord
				   },
				   {
				    	path: 'rechargerecord',
				      name: 'RechargeRecord',
				      component:RechargeRecord
				   }
      ]
    },
    {
    	path: '/improvesuccess',
      name: 'ImproveSuccess',
      component:ImproveSuccess
     
    }
  ]
})
