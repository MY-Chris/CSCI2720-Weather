// HUANG Kaining 1155141441
// HUANG Sida 1155124414
// MA Yuan 1155124344
// ZHANG Wenxuan 1155141413
// ZHAO Jinpei 1155124239
import React, { Component } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";


export default class Register extends Component {
  constructor(props) {
    super(props);
    this.handleRegister = this.handleRegister.bind(this);
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangePassword1 = this.onChangePassword1.bind(this);

    this.state = {
      username: "",
      password: "",
      password1: "",
      successful: false,
      message: ""
    };
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }


  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangePassword1(e) {
    this.setState({
      password1: e.target.value
    });
  }
  handleRegister(e) {
    e.preventDefault();

    this.setState({
      message: "",
      successful: false
    });

    this.form.validateAll();

    if (this.checkBtn.context._errors.length === 0) {
      AuthService.register(
        this.state.username,
        this.state.password
      ).then(
        response => {
          this.setState({
            message: response.data.message,
            successful: true
          });
        },
        error => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          this.setState({
            successful: false,
            message: resMessage
          });
        }
      );
    }
  }

  render() {
    const vpassword1 = value => {
      if (this.state.password1 != this.state.password) {
        return (
            <div className="alert alert-danger" role="alert">
              The password does not match.
            </div>
        );
      }
    };
    const required = value => {
      if (!value) {
        return (
            <div className="alert alert-danger" role="alert">
              This field is required!
            </div>
        );
      }
    };


    const vusername = value => {
      if (value.length < 4 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
              The username must be between 4 and 20 characters.
            </div>
        );
      }
    };

    const vpassword = value => {
      if (value.length < 4 || value.length > 20) {
        return (
            <div className="alert alert-danger" role="alert">
              The password must be between 4 and 20 characters.
            </div>
        );
      }
    };
    return (
        <div className="col d-flex justify-content-center">
          <br/>
          <div className="card card-container" style={{width:"50vw"}}>
            <article className="card-body">

              <h3 className="card-title mb-4 mt-1">Sign Up</h3>

          <Form
            onSubmit={this.handleRegister}
            ref={c => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <Input
                    type="text"
                    className="form-control"
                    name="username"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    validations={[required, vusername]}
                  />
                </div>


                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <Input
                    type="password"
                    className="form-control"
                    name="password"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required, vpassword]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password1">Password</label>
                  <Input
                      type="password"
                      className="form-control"
                      name="password1"
                      value={this.state.password1}
                      onChange={this.onChangePassword1}
                      validations={[required, vpassword1]}
                  />
                </div>
                <br/>
                <div >
                  <button className="btn btn-primary btn-block">Sign Up</button>
                </div>
              </div>
            )}

            {this.state.message && (
              <div className="form-group">
                <div
                  className={
                    this.state.successful
                      ? "alert alert-success"
                      : "alert alert-danger"
                  }
                  role="alert"
                >
                  {this.state.message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={c => {
                this.checkBtn = c;
              }}
            />
          </Form>
            </article>
          </div>

        </div>
    );
  }
}
