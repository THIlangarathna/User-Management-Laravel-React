import { useEffect, useState } from "react";
import { Routes, Route, useNavigate , useParams } from "react-router-dom"
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate();
    const {setNotification} = useStateContext();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    if (id) {
        useEffect(() => {
            setLoading(true);
            axiosClient.get('users/' + id)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data.data);
                })
                .catch((err) => {
                    setLoading(false);
                })
        }, []);
    }

    const onSubmit = (ev) => {
        ev.preventDefault();
        if (user.id) {
            axiosClient.put('/users/' + user.id, user)
                .then(() => {
                    setNotification('User was successfully updated');
                    navigate('/users');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                })
        } else{
            axiosClient.post('/users', user)
                .then(() => {
                    setNotification('User was successfully created');
                    navigate('/users');
                })
                .catch((err) => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data.errors);
                    }
                })
        }
    }

    return (
        <>
            {id ? <h1>Update User : {user.name}</h1> : <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && <div className="text-center">Loading</div>}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading &&
                    <form onSubmit={onSubmit}>
                        <input value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} type="text" placeholder="Full Name" />
                        <input value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} type="email" placeholder="Email" />
                        <input onChange={ev => setUser({ ...user, password: ev.target.value })} type="password" placeholder="Password" />
                        <input onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} type="password" placeholder="Password Confirmation" />
                        <button className="btn">Save</button>
                    </form>
                }
            </div>
        </>
    )
}