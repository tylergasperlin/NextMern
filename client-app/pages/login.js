import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import axios from 'axios'
import {showSuccessMessage, showErrorMessage} from '../helpers/alerts';
import { API } from '../config';
import Link from 'next/link';
import Router from 'next/router'
import {authenticate, isAuth} from '../helpers/auth'
const Login = () => {
    const [state, setState] = useState({
        email: 'gasperlint@gmail.com',
        password: 'gmail.com',
        error: '',
        success: '',
        buttontext: 'Login',
    });

    const { email, password, error, success, buttontext } = state;

    const handleChange = (name) => (e) => {
        
        setState({
            ...state,
            [name]: e.target.value,
            error: '',
            success: '',
            buttontext: 'Login',
        });
    };

    useEffect(() => {
        isAuth() && Router.push('/')
    }, [])

    const handleSubmit = async e => {
        e.preventDefault();
        setState({...state, buttontext: 'Logging in'})
        try {
            const response = await axios.post(`${API}/login`, {
                email, password
            })
            authenticate(response, () => isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user'));
        } catch(error) {
            console.log(error)
            setState({...state, buttonText: 'Login', error: error.response.data.error})
        }
    };

    const loginForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input
                        value={email}
                        onChange={handleChange('email')}
                        type='email'
                        className='form-control'
                        placeholder='Type your email'
                        required
                    />
                </div>
                <div className='form-group'>
                    <input
                        value={password}
                        onChange={handleChange('password')}
                        type='password'
                        className='form-control'
                        placeholder='Type your password'
                        required
                    />
                </div>
                <div className='form-group'>
                    <button className='btn btn-outline-dark'>{buttontext}</button>
                </div>
            </form>
        );
    };

    return (
        <Layout>
            <div className='col-md-6 offset-md-3'>
                <h1>Login</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {loginForm()}
            </div>
        </Layout>
    );
};

export default Login;
