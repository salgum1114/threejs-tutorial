import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Main from './Main';
import CHAPTERS from '../chapters';

class App extends Component {
    render() {
        return (
            <Router>
                <div style={{ height: '100%' }}>
                    <Switch>
                        <Main>
                            <Route exact path="/" render={() => (<Redirect to="/chapter-1" />)} />
                            {
                                CHAPTERS.map((CHAPTER) => {
                                    return (
                                        <Route key={CHAPTER.key} path={`/${CHAPTER.key}`} component={CHAPTER.component} />
                                    );
                                })
                            }
                        </Main>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;
