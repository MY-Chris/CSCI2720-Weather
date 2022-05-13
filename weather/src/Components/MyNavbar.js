import React, { Component } from 'react'
import { Navbar, NavDropdown, Form, FormControl, Button, Nav } from 'react-bootstrap'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Navigate,
    useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import sun from '../images/sun.png';
import moon from '../images/moon.png'

import Login from "./Login";
import Signup from "./Signup";
import Logout from './Logout'
import Admin from "./Admin"
import Table from './Table';
import MapGoogle from './MapGoogle';
import TableSearch from './TableSearch';
import DisplayWeather from './DisplayWeather';
import Favourites from './Favourites';
import Home from "./Home";
import EventBus from "../common/EventBus";
import AuthService from "../services/auth.service";





export default class NavbarComp extends Component {


    constructor(props) {
        super(props);


        this.state = {
            currentUser: undefined,
            theme: "light"
        };

        this.handleTheme = this.handleTheme.bind(this);
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();

        if (user) {
            this.setState({
                currentUser: user,
                userid:AuthService.getUserId()
            });

            document.getElementById("App").classList.remove("Appu");
            document.getElementById("App").classList.add("App");

        }

        let usertheme = "light";
        console.log(sessionStorage.getItem('userid'));
        let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
        if(userid != undefined){
        (async () => {
            const data = await fetch(
              "http://localhost:3001/users/theme/" + userid// GET theme path 
            )
            .then((res) => res.json())
            .then((data) => data);
            console.log(data);
            usertheme = data.preference;
            this.setState({theme: data.preference});
        })();

        document.getElementById("App").classList.remove("light");
        document.getElementById("App").classList.add(usertheme);

        EventBus.on("logout", () => {
            this.logOut();
        });
    }
    }

    componentWillUnmount() {
        EventBus.remove("logout");
    }

    NoMatch() {
        let location = useLocation();
        return (
            <div>
                <h3 style={{color:"white"}}>
                    No match for <code>{location.pathname}</code>
                </h3>
            </div>
        );
    }


    handleTheme(e){
        console.log(this.state.theme);
        let curtheme = this.state.theme;
        let newtheme;
        if(curtheme == "dark"){
          this.setState({theme: "light"});
          newtheme = "light";
        }
        else{
          this.setState({theme: "dark"});
          newtheme = "dark";
        }
        console.log(newtheme);
        console.log(document.getElementById("App"));
        document.getElementById("App").classList.remove(curtheme);
        document.getElementById("App").classList.add(newtheme);

        if(document.getElementById("table")){
            document.getElementById("table").classList.remove(curtheme);
            document.getElementById("table").classList.add(newtheme);
        }

        if(document.getElementById("displayweather")){
            document.getElementById("displayweather").classList.remove(curtheme);
            document.getElementById("displayweather").classList.add(newtheme);
            document.getElementById("comments").classList.remove(curtheme);
            document.getElementById("comments").classList.add(newtheme);
        }
        console.log(document.getElementById("App"));
        let userid = sessionStorage.getItem('userid').toString().substring(1, 25);
        let data = "userId=" + userid + "&theme=" + newtheme;
        console.log(data);
        fetch('http://localhost:3001/users/theme', {
                headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                },
                //mode: 'cors',
                method: 'PUT',
                body: data
            })
            .then(res => res.text())
            .then(data => {
                data.replace(/\n/g, "");
                console.log("put done!");
            })
            .catch((error) => {
              console.error('Error:', error);
            });

      }


    render() {
        const {currentUser} = this.state;
        if (currentUser == undefined) {
            return (

                <Router>
                    <div>
                        <Navbar bg="dark" variant={"dark"} expand="lg">
                            <Navbar.Brand href="/">&emsp;Weathering With Me</Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbarScroll"/>
                            <Navbar.Collapse id="navbarScroll">
                                <Nav
                                    className="mr-auto my-2 my-lg-0"
                                    style={{maxHeight: '100px'}}
                                    navbarScroll
                                >


                                    <Nav.Link as={Link} to="/login">Log in</Nav.Link>
                                    <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                                    <Nav.Link as={Link} to="/admin">Admin</Nav.Link>



                                </Nav>

                            </Navbar.Collapse>
                        </Navbar>
                    </div>
                    <div>
                        <Routes>
                            <Route exact path="/" element={<Home/>}/>
                            <Route exact path="/login" element={<Login/>}/>
                            <Route exact path="/signup" element={<Signup/>}/>
                            <Route exact path="/admin" element={<Admin/>}/>
                            <Route path="*" element={<this.NoMatch/>}/>



                        </Routes>
                    </div>
                </Router>
            )
        }

    else{
        return (
            <div>
            <Router>
                <div>
                    <Navbar bg="dark" variant={"dark"} expand="lg">
                        <Navbar.Brand href="#">&nbsp;
                        <button onClick={this.handleTheme}>{this.state.theme == "dark"? 
                                    <img src={moon} width={40} /> 
                                : <img src={sun} width={40} />}</button>
                        &nbsp;
                        Weathering With Me</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll"/>
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="mr-auto my-2 my-lg-0"
                                style={{maxHeight: '100px'}}
                                navbarScroll
                            >


                                {/*<Nav.Link as={Link} to="/login">Log in</Nav.Link>*/}
                                {/*<Nav.Link as={Link} to="/signup">Sign up</Nav.Link>*/}

                                <Nav.Link as={Link} to="/table">Table</Nav.Link>
                                <Nav.Link as={Link} to="/locations_search">Search</Nav.Link>
                                <Nav.Link as={Link} to="/mapgoogle">Map</Nav.Link>
                                <Nav.Link as={Link} to="/favourites">Favourites</Nav.Link>
                                <Nav.Link as={Link} to="/logout">Log Out</Nav.Link>
                                

                            </Nav>

                        </Navbar.Collapse>
                    </Navbar>

                    <div align="right">Current User: {currentUser}</div>
                </div>
                <div>
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>

                        {/*<Route exact path="/login" element={<Login/>}/>*/}

                        {/*<Route exact path="/signup" element={<Signup/>}/>*/}

                        <Route exact path="/logout" element={<Logout/>}/>

                        <Route exact path="/table" element={<Table/>}/>

                        <Route exact path="/locations_search" element={<TableSearch/>}/>

                        <Route exact path="/mapgoogle" element={<MapGoogle/>}/>

                        <Route exact path="/info/:city" element={<DisplayWeather/>}/>

                        <Route exact path="/favourites" element={<Favourites/>}/>
                        <Route path="*" element={<this.NoMatch/>}/>


                    </Routes>
                </div>
            </Router>
            
            </div>
        )
    }
}
}
