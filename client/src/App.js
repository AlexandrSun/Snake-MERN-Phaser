import React from 'react';
import {useRoutes} from "./routes";
import {BrowserRouter as Router} from "react-router-dom";

function App() {
    const routes = useRoutes();
    return (
        <Router>
            <div className='container'>
                <h1 className='main-title'>The Snake!</h1>
                {routes}
            </div>
        </Router>
    );
}

export default App;