<template>
    <nav class="navbar navbar-expand-lg fixed-top navbar-light bg-light">
        <div class="container">
            <RouterLink to="/posts" aria-current="page" class="navbar-brand btn px-5 mx-2 btn-lg btn-outline-primary">Home</RouterLink> 
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavId" aria-controls="collapsibleNavId"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="collapsibleNavId">
                <ul class="navbar-nav nav flex-grow-1">
                    <RouterLink to="/addpost" aria-current="page" class="nav-item btn px-5 mx-2 btn-lg btn-outline-primary">Add posts</RouterLink> 
                    <li v-if="!this.store.state.jwtStore.token" class="ms-auto nav-item">
                        <RouterLink to="/login" aria-current="page" class="btn px-5 mx-2 btn-lg btn-outline-primary nav-item">Login</RouterLink> 
                        <RouterLink to="/register" aria-current="page" class="btn px-5 mx-2 btn-lg btn-outline-primary nav-item">Sign up</RouterLink>
                    </li>
                    <li v-else class="ms-auto nav-item">
                        <button type="button" @click.prevent="this.logout" class="btn px-5 btn-lg btn-outline-primary nav-item">Logout</button>
                        <RouterLink to="/profile" aria-current="page" class="btn px-5 mx-2 btn-lg btn-outline-primary nav-item">Profile</RouterLink>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>
<script>
import { RouterLink } from 'vue-router'
import { useStore } from 'vuex'
import router from '../router/router'

export default {
    setup()
    {
        const store = useStore()
        const logout = function()
        {
            store.commit('setToken', null)
            localStorage.removeItem('token')
            router.push('/login')
        }
        return{
            store,
            logout
        }
    }
}
</script>

