import Layout from '../components/Layout'

const Register = () => {
    const RegisterForm = () => {
        return (
            <form>
                <div className="form-group">
                    <input type="text" className="form-control" placeholder="Type your name"/>
                </div>
                <div className="form-group">
                    <input type="email" className="form-control" placeholder="Type your email"/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" placeholder="Type your password"/>
                </div>
                <div className="form-group">
                    <button className="btn btn-outline-dark">Register</button>
                </div>
            </form>
        )

    }

    return <Layout>
        <div className="col-md-6 offset-md-3">
            <h1>Register</h1>
            <br/>
            <RegisterForm/>
        </div>
    </Layout>
}

export default Register;