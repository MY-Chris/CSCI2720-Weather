import React, { FC } from "react";
import { Route } from "react-router-dom";
import Login from './Login'
const PrivateRoute: FC<React.ComponentProps<typeof Route>> = props => {
    const userIsLogged = 1;

    return (
        <Route {...props}>{userIsLogged ? props.children : <Login/>}</Route>
    );
};

export default PrivateRoute;