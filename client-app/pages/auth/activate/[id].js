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
    });
    return <Layout>{JSON.stringify(state)}</Layout>;
};

export default withRouter(ActivateAccount);
