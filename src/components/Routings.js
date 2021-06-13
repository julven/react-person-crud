import { Redirect, Route, Switch, withRouter } from 'react-router-dom'
import Home from './Home'
import List from './List'
import Account from './Account'
import Login from './Login'
import PersonAdd from './PersonAdd'
import PersonEdit from './PersonEdit'
import Signup from './Signup'
import { withConnect } from './redux'
import { useState } from 'react'


const Routings = ({accountState, history}) => {
    let [initLink] = useState(history.location.pathname)


    return (
        <div className="container">
            <Switch>
                <Route exact path="/" render={() => accountState.logged ? <Home /> : <Redirect to="/login" />} />
                <Route exact path="/list" render={() => accountState.logged ? <List /> : <Redirect to="/login" />} />
                <Route exact path="/list/:page" render={() => accountState.logged ? <List /> : <Redirect to="/login" />} />
                <Route exact path="/account" render={() => accountState.logged ? <Account /> : <Redirect to="/login" />} />
                
                <Route exact path="/personadd" render={() => accountState.logged ? <PersonAdd /> : <Redirect to="/login" />} />
                <Route exact path="/personedit/:id" render={() => accountState.logged ? <PersonEdit /> : <Redirect to="/login" />} />

                <Route exact path="/login" render={() => !accountState.logged ? <Login /> : <Redirect to={ initLink === "/login" ? "/" : initLink}/>} />
                <Route exact path="/signup" render={() => <Signup />} />

                <Route exact path="*" render={() => <Home />} />
            </Switch>
        </div>
    )
}

export default  withRouter(withConnect(Routings))