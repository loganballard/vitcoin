import React from 'react';
import { Button, Form } from "react-bootstrap";
import Api from '../api';

class UsernamePasswordForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            password: '',
            formName: ''
        };
        this.setPassword = this.setPassword.bind(this);
        this.setUser = this.setUser.bind(this);
        this.submit = this.submit.bind(this);
        this.validateForm = this.validateForm.bind(this);
    }

    setUser(event) {
        this.setState({
            user: event.target.value
        });
    }

    setPassword(event) {
        this.setState({
            password: event.target.value
        });
    }

    validateForm() {
        return this.state.user.length > 0 && this.state.password.length > 0;
    }

    async submit() {
        if (!this.validateForm()) {
            alert("bad login");
            return
        }
        let endpoint = 'account/login'; //(this.state.form_id === 'signin') ? 'signin' : 'newUser';
        let data = {
            'user' : this.state.user,
            'password': this.state.password
        };
        await Api.post(endpoint, data)
            .then(res => {
                alert("successful login");
            }, err => {
                alert("bad login");
            })
            .catch(e => {
                alert("error: " + e.toString());
            });
    }

    render() {
        return (
            <div className="Login">

                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        placeholder="Enter username"
                        type="text"
                        data-test="user"
                        value={this.state.user}
                        onChange={this.setUser}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        placeholder="Password"
                        type="password"
                        data-test="password"
                        value={this.state.password}
                        onChange={this.setPassword}
                    />
                </Form.Group>
                <Button
                    variant="primary"
                    onClick={this.submit}
                >
                    Submit
                </Button>
            </div>
        )
    }
}

export default UsernamePasswordForm;