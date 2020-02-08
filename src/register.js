import React from 'react';

import logo from './static/vc-logo.jpg';
import UsernamePasswordForm from "./components/loginInput";

class Register extends React.Component {
    render() {
        return (
            <div>
                <h1> Register </h1>
                <img src={logo} alt="Vitcoin" />
                <UsernamePasswordForm />
            </div>
        );
    }
}

export default Register;