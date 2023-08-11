<template>
    <div>
        <h3 class="text-center">Posts</h3>
        <div style="margin-top:100px">
            <Post v-for="post in this.posts[this.currentPage]" v-bind:ref="post.id" :socket="socket" :post="post" class="my-3"></Post>
        </div>
        <div class="footer-paginate">
            <span class="numberPage" @click="updatePage(index)" v-for="index in range(1,pages)">{{ index }}</span>
        </div>
    </div>
</template>

<style lang="sass" scoped>
    .footer-paginate
        display: flex
        justify-content: center
        span
            margin: 0 5px
            border: 1px solid silver
            background-color: black
            transition: all .3s
            color: white
            padding: 7px
            &::hover
                background-color: gray
    .numberPage
        cursor: pointer
</style>

<script>
    import { useStore } from 'vuex'
    import Post from '../components/Post.vue'
    import toastr from 'toastr'
    import { io } from 'socket.io-client'
    import router from '../router/router'

    export default {
        data(){
            const socket = io('/')
            const storage = useStore()
            return{
                storage,
                posts: {},
                pages: 0,
                socket,
                currentPage:1
            }
        },  
        methods:{
            range(start, end) {
                return Array(end - start + 1).fill().map((_, index) => start + index);
            },
            async updatePage(pageNumber) {
                
                if(this.posts[pageNumber])
                {
                    this.currentPage = pageNumber
                    return
                }

                const id = this.$route.query.id
                const userid = this.$route.query.userid

                const res = await fetch('/back/posts?id=' + (id || '') +'&userid='+(userid||'')+'&pageNumber='+(pageNumber||''), {
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
                    this.posts[pageNumber] = body.posts 
                    this.pages = body.pages
                    this.currentPage = pageNumber
                }                
            }
        },
        components:{
            Post
        },
        async mounted(){
            const userid = this.$route.query.userid
            const pageNumber = this.$route.query.pageNumber
            const res = await fetch('/back/posts?userid='+(userid||'')+'&pageNumber='+(pageNumber||''), {
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
                this.posts[1] = body.posts 
                this.pages = body.pages
            }
            this.socket.on('reactionUpdate', (data)=>
            {
                const dataEncoded = JSON.parse(data)
                const {postId, reactions} = dataEncoded
                console.log(reactions)
                this.$refs[postId][0].post.reactions = reactions
            })
        }
        
    }
</script>