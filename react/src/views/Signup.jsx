import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const {setToken, setUser} = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload = {
            name : nameRef.current.value,
            email : emailRef.current.value,
            password : passwordRef.current.value,
            password_confirmation : passwordConfirmationRef.current.value
        }

        axiosClient.post('/signup', payload)
        .then(({data}) => {
            setToken(data.token);
            setUser(data.user);
        })
        .catch(err => {
            const response = err.response;
            if(response && response.status == 422){
                setErrors(response.data.errors);
            }
        })
    }

    return (
        <form onSubmit={onSubmit} className="animated fadeInDown">
            <h1 className="title">Signup for Free</h1>
            {errors && 
            <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
            </div>}
            <input ref={nameRef} type="text" placeholder="Full Name" />
            <input ref={emailRef} type="email" placeholder="Email" />
            <input ref={passwordRef} type="password" placeholder="Password" />
            <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
            <button className="btn btn-block">Signup</button>
            <p className="message">
                Already Registered ? <Link to='/login'>Login to your Account</Link>
            </p>
        </form>
    )
}