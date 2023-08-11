<template>
    <Post style="margin-top: 50px" v-if="this.post" :post="this.post"></Post>
</template>

<script>
import toastr from 'toastr'
import { useStore } from 'vuex'
import router from '../router/router'
import Post from '../components/Post.vue'

export default {
    data(){
        const storage = useStore()
        return{ 
            post: null,
            storage
        }
    },
    components:{
        Post
    },
    async mounted(){
        const id = this.$route.query.id
        const res = await fetch('/back/posts?id='+id, {
            headers:{
                token: this.storage.state.jwtStore.token
            },
            method: 'get'
        })
        if(res.status === 403)
        {
            toastr.error(res.status + res.statusText + ' You are not authorized')
            this.storage.commit('setToken', null)
            localStorage.removeItem('token')
            router.push('/login')
        }
        else if(!res.ok)
        {
            toastr.error(res.status + res.statusText)
        }
        else
        {
            const body = await res.json()
            this.post = body.posts[0]
        }  
    }
}
</script>