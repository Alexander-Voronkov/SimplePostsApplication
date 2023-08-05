<template>
    <div style="margin-top:100px">
        <QuillEditor v-model:content="this.content" style="height:250px" :modules="this.modules" theme="snow" toolbar="full" />
    </div>
</template>

<script>

import { QuillEditor } from '@vueup/vue-quill'
import BlotFormatter from 'quill-blot-formatter'

export default {
    data() {
        return {             
            modules : {
                name: 'blotFormatter',  
                module: BlotFormatter, 
                options: {/* options */}
            },
            content:''
        }
    },
    components:{
        QuillEditor
    },
    methods:{
        getContent: function(){
            return this.content
        }
    }
}
</script>
