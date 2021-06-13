import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import Form from './Form'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const Signup = ({history, accountState, accountSetter}) => {

    let context = useContext( GlobalContext )
    let [pass, setPass] = useState({
        pass: "",
        conf: ""
    })
    let [error, setError] = useState({
        error: false,
        msg: ""
    })
    let [success, setSuccess] = useState(false)

    let formChange = (field, value) => {
        accountSetter.accountFormChange({field, value})
    }

    let submit = () => {
        setError({error: false, msg: ""})
        let invalid = false
        let form = {...accountState.form, ...pass}
        delete form.token
    
        Object.keys(form).forEach( x => {
            if(accountState.form[ x ] == "") invalid = true
        });

        
        if(invalid) {
            console.log({missing_fields :accountState.form})
            setError({error: true, msg: "all fields must be filled"})
            return
        }

        let validEmail = /\S+@\S+\.\S+/;
        
        if(!validEmail.test(form.email)) {
            accountSetter.accountFormChange({field: "email", value: ""})
            setError({error: true, msg: "Invalid Email Address"})
            return
        }

        if(form.pass.length < 6 || form.conf.length < 6) {
            setPass({pass: "", conf: ""})
            setError({error: true, msg: "Password must be atleast 4 characters"})
            return
        }

        if(form.pass !== form.conf) {
            setPass({pass: "", conf: ""})
            setError({error: true, msg: "Password and confirm field did not match"})
            return
        }
        
        console.log(form)

        context.server('register', form).then( resp => {
            if(resp.status) {
                setSuccess(true)
                return
            }

            if(!resp.status) {
                let msg = resp.error
                if(resp.error === "EMAIL_EXISTS") msg = "Email already used"
                setError({error: true, msg})
                return
            }
        })
        
    }

    useEffect( () => {
        accountSetter.accountFormClear();
    }, [])

    return (
        <div>
            <h2>Signup</h2>
        {   success ?
            <div style={{ maxWidth: 400 }}>
                <h4 className="text-success">You have successfully registerd!</h4>
                <p>your email: <b>{accountState.form.email}</b></p>
                <Link to="/login">go back to login page</Link>
            </div>
            :
            <div>
                
                {    error.error && 
                    <div className="alert alert-danger alert-dismissible">
                    {error.msg}
                    <button 
                    aria-label="Close"
                    className="btn-close" 
                    onClick={ () => setError({error: false, msg: ""})}></button>
                    </div>
                }
                <Form type="signup" />

                <div style={{ maxWidth: 300 }}>
                
                    <div className="lh-1 mt-2">
                    <label className="form-label mb-1">
                        Email
                        {accountState.form.email === ""&& <span className="text-danger"> required*</span>}
                    </label>
                        <input
                        value={accountState.form.email}
                        onChange={ e => formChange('email', e.target.value)}
                        type="email"
                        className={"form-control "+(accountState.form.email === ""&&'is-invalid')} />
                    </div>
                
                    <div>
                        <div className="mb-1" style={{ maxWidth: 300 }}>
                            <label className="form-label mb-1">
                                Password
                                {pass.pass === ""&& <span className="text-danger"> required*</span>}
                            </label>
                            <input
                            value={pass.pass}
                            onChange={ (e) => setPass({...pass, pass: e.target.value})}
                            type="password"
                            className={"form-control "+(pass.pass === ""&&'is-invalid')} />
                        </div>
                        <div className="mb-1" style={{ maxWidth: 300 }}>
                            <label className="form-label mb-1">
                                Confirm
                                {pass.conf === ""&& <span className="text-danger"> required*</span>}
                            </label>
                            <input
                            value={pass.conf}
                            onChange={ (e) => setPass({...pass, conf: e.target.value})}
                            type="password"
                            className={"form-control "+(pass.conf === ""&&'is-invalid')} />
                        </div>
                        <div className="d-grid gap-2 d-flex justify-content-end mt-4">
                            <button className="btn btn-outline-secondary d-block" onClick={() => history.push("/login")}>Cancel</button>
                            <button className="btn btn-success d-block" onClick={() => submit()}>Register</button>

                        </div>
                    </div>

                </div>

            </div>
        }
        </div>

    )
}

export default withConnect( withRouter(Signup) )