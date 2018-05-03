import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Main from './Main';
import Chapter1 from './Chapter1';
import Chapter2 from './Chapter2';

class App extends Component {
    render() {
        return (
            <Router>
                <div style={{ height: '100%' }}>
                    <Switch>
                        <Main>
                            <Route exact path="/" render={() => (<Redirect to="/chapter-1" />)} />
                            <Route path="/chapter-1" component={Chapter1} />
                            <Route path="/chapter-2" component={Chapter2} />
                        </Main>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
