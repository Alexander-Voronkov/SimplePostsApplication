<template>
    <div class="container mt-3 border">
        <div v-bind:innerHTML="this.post.postText" class="my-5 p-3"></div>
        <div class="text-end">Written by {{ this.post.user.name }} on {{ new Date(this.post.createdAt).toLocaleDateString() }}</div>
    </div>
</template>

<script>

export default {
    props:{
        post:{
            type: Object,
            required: true
        }
    }
}

</script>
