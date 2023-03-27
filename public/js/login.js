import axios from 'axios';
import {showAlert} from './alert'
import {hideAlert} from './alert'

export const login = async (email, password) => {
    try{
        const res = await axios({
            method: 'POST',
            url:'http://127.0.0.1:3000/api/v1/users/login',
    
            data: {
                email: email,
                password: password
            }
        })
        if (res.data.status ==='success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(function(){
                location.assign('/')
            },1500)
        }
        console.log(res)
    } catch (err) {
        showAlert('error',"Log in Unsuccessful");
    }
}
export const logout = async ()=>{
    try{
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
            
        })
        if (res.data.status== 'success') window.setTimeout(()=>{
            location.reload(true);
        },1000)

    }catch(err){
        showAlert('error',"Log in Unsuccessful");
    }
}