import Layout from '../../components/Layout';
import axios from 'axios';


const User = ({todos}) => {
    return <Layout>{JSON.stringify(todos)}</Layout>
}

// getInitialProps is a method specific to Next that allows for server side rendering
// Server side rendering good for SEO because the page is rendered with data
User.getInitialProps = async () => {
    const response = await axios.get(`https://jsonplaceholder.typicode.com/todos`);
    console.log('SERVER RENDERED', response)
    return {
        todos: response.data
    }
}

export default User;