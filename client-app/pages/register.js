import Layout from '../components/Layout';
import { useState } from 'react';
import axios from 'axios'
import {showSuccessMessage, showErrorMessage} from '../helpers/alerts';
import { API } from '../config';

const Register = () => {
    const [state, setState] = useState({
        name: 'mosoe',
        email: 'moseu@gmail.com',
        password: 'asfasfw',
        error: '',
        success: '',
        buttontext: 'Register',
    });

    const { name, email, password, error, success, buttontext } = state;

    const handleChange = (name) => (e) => {
        
        setState({
            ...state,
            [name]: e.target.value,
            error: '',
            success: '',
            buttontext: 'Register',
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setState({...state, buttontext: 'Registering'})
        try {
            const response = await axios.post(`${API}/register`, {
                name, email, password
            })
            setState({
                ...state,
                name: '',
                email: '',
                password: '',
                buttonText: 'Submitted',
                success: response.data.message
            })
        } catch(error) {
            console.log(error)
            setState({...state, buttonText: 'Register', error: error.response.data.error})
        }
    };

    const RegisterForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input
                        value={name}
                        onChange={handleChange('name')}
                        type='text'
                        className='form-control'
                        placeholder='Type your name'
                    />
                </div>
                <div className='form-group'>
                    <input
                        value={email}
                        onChange={handleChange('email')}
                        type='email'
                        className='form-control'
                        placeholder='Type your email'
                    />
                </div>
                <div className='form-group'>
                    <input
                        value={password}
                        onChange={handleChange('password')}
                        type='password'
                        className='form-control'
                        placeholder='Type your password'
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
                <h1>Register</h1>
                <br />
                {success && showSuccessMessage(success)}
                {error && showErrorMessage(error)}
                {RegisterForm()}
            </div>
        </Layout>
    );
};

export default Register;
