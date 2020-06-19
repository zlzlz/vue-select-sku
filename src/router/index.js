import Vue from 'vue'
import Router from 'vue-router'
import SelectSKU from '@/components/SelectSKU'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SelectSKU',
      component: SelectSKU
    }
  ]
})
