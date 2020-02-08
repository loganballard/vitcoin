import React from 'react';

import logo from './static/vc-logo.jpg';
import UsernamePasswordForm from './components/loginInput';

class SignIn extends React.Component {
    render() {
        return (
            <div>
                <h1> Sign In </h1>
                <img src={logo} alt="Vitcoin" />
                <UsernamePasswordForm />
            </div>
        )
    }
}

export default SignIn;