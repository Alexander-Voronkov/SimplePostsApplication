<template>
  <div style="margin-top:100px">
    <div v-if="this.store.state.otherData.isPreload" class="position-absolute mx-auto my-auto" style="left:50%; top:50%;">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
    <form enctype="multipart/form-data" v-else name="registerForm" @submit.prevent="this.submitRegister">
        <div class="container">
          <div class="row">
            <div class="col-6">
              <div class="text-primary display-5 text-center">Sign up</div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" required class="form-control" name="email" id="email" aria-describedby="emailHelpId" placeholder="abc@mail.com">
                  <small id="emailHelpId" class="form-text text-muted">Enter your email:</small>
                </div>
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input type="text" required
                    class="form-control" name="name" id="name" aria-describedby="helpId" placeholder="">
                  <small id="helpId" class="form-text text-muted">Enter your name.</small>
                </div>
                <div class="mb-3">
                  <label for="birthDate" class="form-label">Birth date</label>
                  <input type="date" required
                    class="form-control" name="birthDate" id="birthDate" aria-describedby="helpId" placeholder="">
                  <small id="helpId" class="form-text text-muted">Enter your birth date.</small>
                </div>
                <div class="mb-3">
                  <label for="phone" class="form-label">Phone number</label>
                  <input type="tel"
                    class="form-control" name="phoneNumber" id="phone" aria-describedby="helpId" placeholder="">
                  <small id="helpId" class="form-text text-muted">Enter your phone.</small>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input minlength="8" type="password" required class="form-control" name="password" id="password" placeholder="Enter your password:">
                </div>
                <div class="mb-3">
                  <label for="repeatPassword" class="form-label">Repeat password</label>
                  <input minlength="8" @input="this.inputEvent" type="password" required class="form-control" id="repeatPassword" placeholder="Repeat your password:">
                </div>
              <button class="btn btn-primary" type="submit">Register</button>
            </div>
            <div class="col-6">
                <label for="avatar">Choose your profile picture: </label>
                <input @change="onFileChange" name="avatar" id="avatar" type="file" class="form-control mt-3" accept=".jpeg,.jpg,.png,.bmp,.gif">
                <img id="avatarPreview" class="mt-3" v-if="avatar" v-bind:src="base64avatar" width="500" height="400">
            </div>
          </div>          
        </div>
        
    </form>
  </div>
    
</template>

<script>
  import toastr from 'toastr'
  import router from '../router/router'
  import { useStore } from 'vuex'
  import jwtDecode from 'jwt-decode'
  import {computed, reactive, ref} from 'vue'

  export default {
    setup(){
      const store = useStore()
      const submitRegister = async e=>
      {
          store.commit('setPreload', true)

          const formdata = new FormData(e.target)

          const resp = await fetch('/back/register', {
              method: 'POST',
              body: formdata,
          })
          if(!resp.ok)
              toastr.error(resp.status + resp.statusText)
          else
          {
            resp.json().then(value=>{
              toastr.success('Welcome ' + jwtDecode(value.token).name)
              store.commit('setToken', value.token)
              localStorage.setItem('token', value.token)
              router.push('/posts')
            })
          }
          store.commit('setPreload', false)
      }
      const inputEvent = function(e)
      {
        const repeat = e.target
        const form = document.forms.registerForm.elements
            if(repeat.value !== form.password.value)
            {
              repeat.setCustomValidity('Пароли не совпадают')
            }
            else
            {
              repeat.setCustomValidity('')
            }
      }
      const avatar = ref(null)
      const onFileChange = (e)=>{
        const img = document.getElementById('avatarPreview')
        if(img)
          URL.revokeObjectURL(img.src)

        if(e.target.files)
          avatar.value = e.target.files[0]
        else
          avatar.value = null
      }
      const base64avatar = computed(()=>{
        if(avatar.value)
            return URL.createObjectURL(avatar.value)
        return null
      })

      return {
        store,
        submitRegister,
        inputEvent,
        avatar,
        onFileChange,
        base64avatar,
      }
    },
    mounted()
    {
      if(this.store.state.jwtStore.token) {
        toastr.warning('You are already authorized')
        router.push('/posts')
      }
    },
  }    
</script>

<style scoped>
  input{
    width: 60%;
  }
</style>
