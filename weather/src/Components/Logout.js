import React, { Component } from 'react'
import AuthService from "../services/auth.service";


export default class Logout extends Component {
    render() {
        // localStorage.removeItem("user");
        // this.setState({
        //     currentUser: undefined,
        // });
        return (
            <div>
                <h2>Logout Successfully</h2>
            </div>
        )
    }
}
