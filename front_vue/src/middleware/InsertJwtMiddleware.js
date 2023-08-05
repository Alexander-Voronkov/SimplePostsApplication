import toastr from 'toastr'
import jwt_decode from 'jwt-decode'
import { useStore } from 'vuex'

export default function insertJWTMiddleware(to, from, next) 
{
    const storage = useStore()
    const token = localStorage.getItem('token')

    if(token)
      storage.commit('setToken', token)
      
    const jwtToken = storage.state.jwtStore.token

    if (jwtToken) {

      let decodedToken;
      try
      {
        decodedToken = jwt_decode(jwtToken)
      }
      catch
      {
        toastr.warning('Error while reading token')
        localStorage.removeItem('token')
        storage.commit('setToken', null)
        next('/login')
      }

      const currentTime = Date.now() / 1000

      if (decodedToken.exp > currentTime)
      {
        next();
      } 
      else 
      {
        toastr.warning('Your session\'s expired')
        localStorage.removeItem('token')
        storage.commit('setToken', null)
        next('/login')
      }
    } 
    else
    {
      toastr.warning('You are not authorized')
      next('/login');
    }
}

