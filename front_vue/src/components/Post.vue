<template>
    <div class="container mt-3 border">
        <div v-bind:innerHTML="this.post.postText" class="my-5 p-3"></div>
        <div class="reactions">
            <span>
                <font-awesome-icon :class="{reactionIcon:true, likedIcon: this.isLike}" @click="this.like" icon="fa-solid fa-thumbs-up" /><span>{{ likeCount }}</span>
                <font-awesome-icon :class="{reactionIcon: true, dislikedIcon: this.isDislike}" @click="this.dislike" icon="fa-solid fa-thumbs-down" /><span>{{ dislikeCount }}</span>
            </span>
            <span>Written by {{ this.post.user.name }} on {{ new Date(this.post.createdAt).toLocaleDateString() }}</span>
        </div>        
    </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { useStore } from 'vuex'

export default {
    props:{
        post:{
            type: Object,
            required: true
        },
        socket:{
            type: Object,
            required: false
        }
    },
    data(){
        const store = useStore()

        return {
            store
        }
    },
    computed:{
        likeCount(){
            return this.post.reactions.filter(x=>x.type==='like').length
        },        
        dislikeCount() {
            return this.post.reactions.length - this.likeCount
        },
        isLike() {
            const userId = jwtDecode(this.store.state.jwtStore.token).id
            return this.post.reactions.filter(x=>x.userId === userId && x.type === 'like').length === 1
        },
        isDislike(){
            const userId = jwtDecode(this.store.state.jwtStore.token).id
            if(!this.isLike)
                return this.post.reactions.filter(x=>x.userId === userId && x.type === 'dislike').length === 1
            return false
        }
        
    },
    methods:{
        async like(){
            if(this.socket)
                this.socket.emit('reaction', JSON.stringify({
                    type: 'like',
                    token: this.store.state.jwtStore.token,
                    postId: this.post.id
                }))
        },
        async dislike(){
            if(this.socket)
                this.socket.emit('reaction', JSON.stringify({
                    type: 'dislike',
                    token: this.store.state.jwtStore.token,
                    postId: this.post.id
                }))
        }
    }
}

</script>

<style lang="sass" scoped>
.reactionIcon
    transition: all 0.3s
    cursor: pointer

.likedIcon
    color: lightblue

.dislikedIcon
    color: red

.reactions
    display: flex
    justify-content: space-between
    align-items: center
    span:first-child
        *
            margin: 7px 25px
            font-size: 27pt
</style>
