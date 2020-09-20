import { ButtonDropdown } from "reactstrap";
import {useState, useEffect} from 'react';
import { signin, authenticate, isAuth } from '../../actions/auth';
import Router from "next/router";
import LoginGoogle from './LoginGoogle';
import Link from 'next/link';

const SigninComponent = () => {
    const [values, setValues] = useState({
        email: 'abc@gamil.com',
        password: 'abc',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const { email, password, error, loading, message, showForm} = values;

    useEffect(()=>{
        isAuth() && Router.push('/');
    },[]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading: true, error: false});
        const user = { email, password};

        signin(user)
        .then(data => {
            if (data) {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                } else {
                    //save user token to cookie
                    //save user info to local storage
                    //authenticate user
                    authenticate(data, ()=> {
                        if(isAuth() && isAuth().role == 1){
                            Router.push('/admin');
                        } else {
                            Router.push('/user');
                        }

                    })
                }
            }
        })
    }
    const handleChange = (name) => (e) => {
        setValues({...values, error: false, [name]: e.target.value});
    }
    const showLoading = () => (loading ? <div className="alert alert-info" role="alert">loading ...</div> : '');
    const showError = () => (error ? <div className="alert alert-danger" role="alert">{error}</div> : '');
    const showMessage = () => (message ? <div className="alert alert-info" role="alert">{message}</div> : '');

    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="email" value={email} onChange={handleChange('email')} className="form-control" placeholder="Type your email"/>
                </div>
                <div className="form-group">
                    <input type="password" value={password} onChange={handleChange('password')} className="form-control" placeholder="Type your password"/>
                </div>
                <div>
                    <button className="btn btn-primary">Signin</button>
                </div>
            </form>
        );
    }
    return (
        <React.Fragment>
            {showLoading()}
            {showError()}
            {showMessage()}
            <LoginGoogle />
            {showForm && signinForm()}
            <br />
            <Link href="/auth/password/forgot">
                <a className="btn btn-outline-danger btn-sm">Forgot password</a>
            </Link>
        </React.Fragment>
    );
}

export default SigninComponent;