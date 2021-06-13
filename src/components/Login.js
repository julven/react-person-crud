import React, { useState, useEffect, useContext } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux';

const Login = ({ history, accountState, accountSetter }) => {

    let context = useContext(GlobalContext);

    let [form, setForm] = useState({
        email: "",
        pass: "",
    })

    let [error, setError] = useState(false);
    let [resetSent, showResetSent] = useState(false)
    let [resetPass, showResetPass] = useState(false)

    let forgotPass = e => {
        e.preventDefault();
        showResetPass(true);
    }

    let submitResetPass = () => {
        let validEmail = /\S+@\S+\.\S+/;
        
        if(!validEmail.test(form.email)) {
            alert("invalid email address: "+form.email)
            setForm({...form, email: ""})
            return
        }

        fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="+process.env.REACT_APP_FIREBASE_API_KEY, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({requestType: "PASSWORD_RESET", email: form.email})
        }).then( () => showResetSent(true))
    }

    let login = () => {
        setError(false);
        // console.log({ login: form })
        if(form.email == "" || form.pass == "") {
            setError(true);
            return;
        }
        context.server("login", form).then( resp => {
            if(!resp.status) {
                setError(true);
                return;
            }
            if(resp.status) {
                resp.data.logged = true
                accountSetter.accountSet(resp.data);
                history.push("/")
                return
            }
        })
    }

    useEffect(() => {

    }, [])



    return (
        <div>
            { !resetPass ?
                <div>
                    <h2>Login</h2>
                    {error &&
                        <div className="alert alert-danger alert-dismissible">
                        Invalid Username or Password
                        <button 
                        onClick={ () => setError(false)}
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"></button>
                    </div>
                    }
                    <div className=" col-12 col-sm-8 col-md-5 col-lg-4 col-xl-3">
                    
                        <div style={{ maxWidth: 300 }}>
                           
                            <div className="mb-1">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    type="email"
                                    className={"form-control "+ (error?"is-invalid":"")}
                                    id="email"
                                    placeholder="name@example.com" />
                            </div>

                            <div className="mb-1">
                                <label htmlFor="password" className="form-label">Password</label>
                                <input
                                    value={form.pass}
                                    onChange={e => setForm({ ...form, pass: e.target.value })}
                                    type="password"
                                    className={"form-control "+ (error?"is-invalid":"")}
                                    id="password" />
                            </div>

                            <div className="d-flex mt-3 d-grid gap-2 justify-content-end">
                                <button className="btn btn-outline-success" onClick={() => history.push("/signup")}>Signup</button>
                                <button className="btn btn-primary" onClick={() => login()}>Login</button>
                            </div>

                            <a href="/" onClick={e => forgotPass(e)} className="float-end my-2">Forgot Password</a>
                        </div>
                    </div>
                </div>
                :
                <div>
                    <h2>Forgot Password</h2>
                    {   resetSent && 
                        <div className="alert alert-info alert-dismissible">
                        A reset password link has been sent to your email. 
                        <button 
                        onClick={ () => resetSent(false)}
                        type="button" 
                        className="btn-close" 
                        aria-label="Close"></button>
                        </div>
                    }
                    <div className=" col-12 col-sm-8 col-md-5 col-lg-4 col-xl-3">
                        <div style={{ maxWidth: 300 }}>
                            <div className="mb-1">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <input
                                    value={form.email}
                                    onChange={e => setForm({ ...form, email: e.target.value })}
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="name@example.com" />

                                <div className="d-flex mt-3 d-grid gap-2 justify-content-end">
                                    <button className="btn btn-outline-secondary" onClick={() => showResetPass(false)}>cancel</button>
                                    <button className="btn btn-success" onClick={() => submitResetPass()}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    )
}

export default withConnect(withRouter(Login)) 