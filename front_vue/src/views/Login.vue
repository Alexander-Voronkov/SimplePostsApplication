<template>
  <div style="margin-top:100px">
    <div v-if="this.store.state.otherData.isPreload" class="position-absolute" style="left:50%; top:50%;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <form v-else method="post" @submit.prevent="this.submitLogin">
        <div class="text-primary display-5 text-center">Login</div>
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email"
            class="form-control" name="email" id="email" placeholder="Enter your email:" required>
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" minlength="8" class="form-control"
           name="password" id="password" placeholder="Enter your password:" required>
        </div>
        <button type="submit" class="btn btn-primary" >Login</button>
    </form>
  </div>
   
</template>

<script>

import toastr from 'toastr'
import router from '../router/router'
import { useStore } from 'vuex'
import jwtDecode from 'jwt-decode'

export default {
  setup(){
    const store = useStore()
    const submitLogin = async e =>
        {  
          store.commit('setPreload', true)
          const resp = await fetch('/back/login', {
                  method: 'POST',
                  headers: {
                  'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(Object.fromEntries(new FormData(e.target))),
              })
          
          if(!resp.ok)
          {
            toastr.error(resp.status + resp.statusText)
          }
          else 
          {
            resp.json().then(value=>{
              toastr.success('Welcome back ' + jwtDecode(value.token).name)
              store.commit('setToken', value.token)
              localStorage.setItem('token', value.token)
              router.push('/posts')
            })
          }
          
          store.commit('setPreload', false)
        }
    return {
      store,
      submitLogin
    }
  },
  mounted()
    {
      if(this.store.state.jwtStore.token) {
        toastr.warning('You are already authorized')
        router.push('/posts')
      }
    }
}
</script>

<style scoped>
  input{
    width: 60%
  }
</style>
