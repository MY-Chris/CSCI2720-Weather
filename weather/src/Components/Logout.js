import React, { Component } from 'react'
import AuthService from "../services/auth.service";


export default class Logout extends Component {
    render() {
        AuthService.logout();
        window.setTimeout(function(){

            window.location.href = "/";

        }, 3000);
        // });
        return (
            <div>
                <h2 style={{color:"#a0ccee"}}>Logout Successfully</h2>
            </div>
        )
    }
}
