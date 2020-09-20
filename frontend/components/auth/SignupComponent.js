import { ButtonDropdown } from "reactstrap";
import {useState, useEffect} from 'react';
import { signup, isAuth } from '../../actions/auth';
import Router from "next/router";

const SignupComponent = () => {
    const [values, setValues] = useState({
        name: 'abc',
        email: 'abc@gamil.com',
        password: 'abc',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const {name, email, password, error, loading, message} = values;

    useEffect(()=>{
        isAuth() && Router.push('/');
    },[]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading: true, error: false});
        const user = {name, email, password};

        signup(user)
        .then(data => {
            if (data) {
                if (data.error) {
                    setValues({ ...values, error: data.error, loading: false });
                } else {
                    setValues({
                        ...values,
                        name: '',
                        email: '',
                        password: '',
                        error: false,
                        loading: false,
                        message: data.message,
                        showForm: false
                    });
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

    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input type="text" value={name} onChange={handleChange('name')} className="form-control" placeholder="Type your name"/>
                </div>
                <div className="form-group">
                    <input type="email" value={email} onChange={handleChange('email')} className="form-control" placeholder="Type your email"/>
                </div>
                <div className="form-group">
                    <input type="password" value={password} onChange={handleChange('password')} className="form-control" placeholder="Type your password"/>
                </div>
                <div>
                    <button className="btn btn-primary">Signup</button>
                </div>
            </form>
        );
    }
    return (
        <React.Fragment>
            {showLoading()}
            {showError()}
            {showMessage()}
            {signupForm()}
        </React.Fragment>
    );
}

export default SignupComponent;