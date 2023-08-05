<template>
    <div class="container mt-5">
    <div class="text-center display-4">Your profile</div>
    <form>
      <div class="form-group">
        <label for="name">Name</label>
        <input disabled type="text" class="form-control" v-model="name" id="name" placeholder="Enter your name">
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input disabled type="email" class="form-control" v-model="email" id="email" placeholder="Enter email">
      </div>
      <div class="form-group">
        <label for="phone">Phone</label>
        <input disabled type="tel" class="form-control" v-model="phoneNumber" id="phone" placeholder="Enter your phone">
      </div>
      <div class="form-group">
        <label for="avatar">Avatar</label>
        <br>
        <input disabled type="file" class="form-control-file" id="avatarInput" @change="this.handleAvatarChange">
        <br>
        <img v-if="this.avatarSrc" id="avatar" :src="this.avatarSrc">
      </div>
      <div class="form-group">
        <label for="birthDate">Birth date</label>
        <input disabled type="date" class="form-control" v-model="birthDate" id="birthDate">
      </div>
    </form>
  </div>
</template>

<script>

import { useStore } from 'vuex'
import toastr from 'toastr'
import router from '../router/router'


export default {
    data(){
    const storage = useStore()
        return{
            name: '',
            email: '',
            phoneNumber: '',
            avatar: null,
            birthDate: null,
            storage
        }
    },
    computed:{
        avatarSrc(){
            const img = document.getElementById('avatar')
            if(img)
                URL.revokeObjectURL(img.src)
            if(this.avatar)
                return URL.createObjectURL(this.avatar)
            return null
        }
    },
    methods:{
        handleAvatarChange(e){
            this.avatar = e.target.files[0]
        },
    },
    beforeRouteEnter(to, from, next){
        next(async vm=>{
            const res = await fetch('/back/profile', {
                headers:{
                    token: vm.storage.state.jwtStore.token
                },
                method: 'get'
            })

            if(res.status === 403)
            {
                toastr.error(res.status + res.statusText + ' You are not authorized')
                vm.storage.commit('setToken', null)
                localStorage.removeItem('token')
                router.push('/login')
            }
            else
            {
                const bodyUser = (await res.json()).datatosend
                vm.email = bodyUser.email
                vm.name = bodyUser.name
                vm.birthDate = new Date(bodyUser.birthDate).toISOString().split('T')[0]
                vm.phoneNumber = bodyUser.phoneNumber
                if(bodyUser.avatar)
                {
                    const arr = new Uint8Array(bodyUser.avatar.data.data)
                    const file = new File([arr], vm.email, { type: bodyUser.avatar.mime })
                    const dt = new DataTransfer()
                    dt.items.add(file)
                    const avatarInput = document.getElementById('avatarInput')
                    avatarInput.files = dt.files
                    avatarInput.dispatchEvent(new Event('change', {
                        bubbles: true,
                        cancelable: true
                    }))
                }
            }
        })
    }
}
</script>

<style lang="sass" scoped>
    .container
        &>form>*
            margin: 10px 0
    img
        width:300px
        margin-top:15px
</style>
