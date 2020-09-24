import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import {StartPage} from "./pages/StartPage";
import {ScorePage} from "./pages/ScorePage";
import {Login} from "./pages/Login";

export const useRoutes = () => {
    return (
        <Switch>
            <Route path="/" exact>
                <Login />
            </Route>
            <Route path="/game">
                <StartPage />
            </Route>
            <Route path="/score">
                <ScorePage />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
};
