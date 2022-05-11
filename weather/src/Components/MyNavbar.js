import React, { Component } from 'react'
import { Navbar, NavDropdown, Form, FormControl, Button, Nav } from 'react-bootstrap'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";

import Home from './Home';
import Login from './Login'
import Signup from './Signup'
import Logout from './Logout'
import Table from './Table';
import MapGoogle from './MapGoogle';
import TableSearch from './TableSearch';
import DisplayWeather from './DisplayWeather';
import Favourites from './Favourites';


export default class NavbarComp extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Navbar bg="dark" variant={"dark"} expand="lg">
                        <Navbar.Brand href="#">&emsp;Weathering With Me</Navbar.Brand>
                        <Navbar.Toggle aria-controls="navbarScroll" />
                        <Navbar.Collapse id="navbarScroll">
                            <Nav
                                className="mr-auto my-2 my-lg-0"
                                style={{ maxHeight: '100px' }}
                                navbarScroll
                            >
                                <Nav.Link as={Link} to="/">Home</Nav.Link>
                                <Nav.Link as={Link} to="/login">Log in</Nav.Link>
                                <Nav.Link as={Link} to="/signup">Sign up</Nav.Link>
                                <Nav.Link as={Link} to="/table">Table</Nav.Link>
                                <Nav.Link as={Link} to="/tablesearch">Search</Nav.Link>
                                <Nav.Link as={Link} to="/mapgoogle">Map</Nav.Link>
                                <Nav.Link as={Link} to="/favourites">Favourites</Nav.Link>

                            </Nav>

                        </Navbar.Collapse>
                    </Navbar>
                </div>
                <div>
                    <Routes>
                        <Route exact path="/login" element={<Login/>}/>

                        <Route exact path="/signup" element={<Signup/>}/>

                        <Route exact path="/table" element={<Table/>}/>

                        <Route exact path="/tablesearch" element={<TableSearch/>}/>

                        <Route exact path="/mapgoogle" element={<MapGoogle/>}/>

                        <Route exact path="/info/:city" element={<DisplayWeather/>}/>

                        <Route exact path="/favourites" element={<Favourites/>}/>

                        <Route exact path="/" element={<Home/>}/>

                    </Routes>
                </div>
            </Router>
        )
    }
}

