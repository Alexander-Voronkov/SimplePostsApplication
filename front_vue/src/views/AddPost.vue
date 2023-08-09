<template>
    <div style="margin-top:100px">
        <div class="display-4 text-center">Write your own post!</div>
        <Editor ref="editor"></Editor>
        <button class="btn btn-primary px-5 my-5" @click.prevent="this.submitAdd">Add post</button>
    </div>
</template>

<script>
import Editor from '../components/Editor.vue'
import { useStore } from 'vuex'
import router from '../router/router'
import toastr from 'toastr'
import {QuillDeltaToHtmlConverter} from 'quill-delta-to-html'

export default {
    data(){
    const storage = useStore()
        return {
            storage,
        }
    },
    components:{
        Editor
    },
    methods:{
        async submitAdd(){
            const content = this.$refs.editor.getContent()
            const converter = new QuillDeltaToHtmlConverter(content.ops, {})
            const converted = converter.convert()

            const res = await fetch('/back/addpost',{
                method: 'post',
                headers:{
                    'Content-Type':'application/json',
                    token: this.storage.state.jwtStore.token
                },
                body: JSON.stringify({converted})
            })

            if(res.status === 403)
            {
                toastr.error(res.status + res.statusText + ' You are not authorized')
                storage.commit('setToken', null)
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
                toastr.success('Your post has been successfully added!')
                router.push('/posts?id='+ body.id)
            }
        }
    }
}
</script>
