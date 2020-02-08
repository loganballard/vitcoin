import React from 'react';
import ReactDOM from 'react-dom';
import NameForm from "./signin";
import Register from "./register";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";


ReactDOM.render(<Routing />, document.getElementById('root'));

export default function Routing() {
    return (
        <Router>
                <Switch>
                    <Route exact path="/">
                        <NameForm />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                </Switch>
        </Router>
    );
}