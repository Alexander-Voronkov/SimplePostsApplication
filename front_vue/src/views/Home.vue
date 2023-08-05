<template>
    <div>
        <h3 class="text-center">Posts</h3>
        <div style="margin-top:100px">
            <Post v-for="post in this.posts" :post="post" class="my-3"></Post>
        </div>
    </div>
</template>

<script>
    import { useStore } from 'vuex'
    import Post from '../components/Post.vue'
    import toastr from 'toastr'

    export default {
        data(){
        const storage = useStore()
            return{
                storage,
                posts: [],
            }
        },  
        components:{
            Post
        },
        beforeRouteEnter(to, from, next) {
            // Вызывается перед монтированием компонента
            next(async vm => {
            // vm - это экземпляр компонента
                const id = vm.$route.query.id
                const userid = vm.$route.query.userid
                const res = await fetch('/back/posts?id=' + (id || '') +'&userid='+(userid||''), {
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
                else if(!res.ok)
                {
                    toastr.error(res.status + res.statusText)
                }
                else
                {
                    vm.posts = await res.json()
                }
            })
        }
        
    }
</script>

<style lang="scss" scoped>
    
</style>