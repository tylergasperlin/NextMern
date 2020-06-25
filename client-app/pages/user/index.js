import Layout from '../../components/Layout';
import axios from 'axios';
import { getCookie } from '../../helpers/auth'
import { API } from '../../config'
const User = ({user}) => {
    return (
        <Layout>
            {JSON.stringify(user)}
        </Layout>

    )
}

// getInitialProps is a method specific to Next that allows for server side rendering
// Server side rendering good for SEO because the page is rendered with data
User.getInitialProps = async context => {
    const token = getCookie('token', context.req)

    try {
        const response = await axios.get( `${API}/user`, {
            headers: {
                authorization: `Bearer ${token}`,
                contentType: 'application/json'
            }
        })
        return { user: response.data }
    } catch (error) {
        console.log(error)
        if(error.response.status === 401) {
            return {user: 'no user'}
        }
    }
};

export default User;