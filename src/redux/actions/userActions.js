import axios from 'axios';
import { urlBackend } from '../../App';

const userActions = {

    signUpUser: (user) => {

        const userData = {
            fullName: user.firstName + " " + user.lastName,
            email: user.email,
            password: user.password,
            from: user.from,
            aplication: "heroes"
        }

        return async (dispatch, getState) => {
            const res = await axios.post(`${urlBackend}/api/users/auth/signup`, { userData })

            dispatch({
                type: 'message',
                payload: {
                    view: true,
                    message: res.data.message,
                    success: res.data.success
                }
            });

        }

    },
    signInUser: (userData) => {

        return async (dispatch, getState) => {

            const user = await axios.post(`${urlBackend}/api/users/auth/signin`, { userData })

            if (user.data.success) {
                localStorage.setItem("token", user.data.response.token)
                dispatch({ type: 'user', payload: user.data.response.dataUser });
            }

            dispatch({
                type: 'message',
                payload: {
                    view: true,
                    message: user.data.message,
                    success: user.data.success
                }
            });
        }
    },
    SignOutUser: (closeuser) => {
        return async (dispatch, getState) => {
            const user = await axios.post(`${urlBackend}/api/auth/signOut`, { closeuser })
            localStorage.removeItem('token')
            dispatch({ type: 'user', payload: null });
            return user
        }

    },
    VerificarToken: (token) => {
        return async (dispatch, getState) => {
            await axios.get(`${urlBackend}/api/users/auth/signInToken`, {
                headers: { 'Authorization': 'Bearer ' + token }
            })
                .then(user => {
                    console.log(user)
                    if (user.data.success) {
                        dispatch({ type: "user", payload: user.data.response })
                        dispatch({
                            type: "message",
                            payload:
                            {
                                view: true,
                                message: user.data.message,
                                success: user.data.success
                            }
                        })
                    }else {
                        console.log(user)
                        localStorage.removeItem("token")}
                }).catch(error =>{
                    console.log(error)
                    if(error.response.status === 401){
                        dispatch({
                            type: "message",
                            payload:
                            {
                                view: true,
                                message: "Por favor realiza nuevamente signIn",
                                success: false
                            }
                        })
                        localStorage.removeItem("token")
                    }
                })
        }
    }

}
export default userActions;