import { wtihRouter, withRouter } from 'next/router';
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import Layout from '../../../components/Layout';

const ActivateAccount = ({ router }) => {
    const [state, setState] = useState({
        name: '',
        token: '',
        buttontext: 'Activate Account',
        error: '',
        success: '',
    });

    const { name, token, buttontext, success, error } = state;

    useEffect(() => {
        let token = router.query.id;
        if (token) {
            const { name } = jwt.decode(token);
            setState({ ...state, name, token });
        }
    },[router]);

    const clickSubmit = async (e) => {
        e.preventDefault();
        setState({...state, buttonText: 'Activating'})
        try {
            const response = await axios.post(`${API}/register/activate`, {token})
            console.log('account activate response', response)
            setState({...state,name:'', token: '', buttontext:'Activated', success: response.data.message})
        } catch(error){
            setState({...state, buttontext:'Activate Account', error: error.response.data.error})
        }
    };
    return (
        <Layout>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h1>Good day {name}, React to activate your account?</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                    <button onClick={clickSubmit} className='btn btn-outline-warning btn-block'>
                        {buttontext}
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default withRouter(ActivateAccount);
