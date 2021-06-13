import React, { useState, useEffect, useContext, useRef } from 'react'
import Form from './Form'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const Account = ({ accountState, accountSetter }) => {

    let context = useContext( GlobalContext )
    let [editPass, setEditPass] = useState(false)
    let [error, setError] = useState(false);
    let [errMsg, setErrMsg] = useState("");
    let pass = [useRef(null), useRef(null)];

    let updateInfo = () => {
        setError(false)
        accountSetter.accountAlertSuccessSet(false)

        let error = false;
        Object.keys(accountState.form).forEach( x => {
            if( accountState.form[ x ] === "") error = true
        })

        if(error) {
            setErrMsg("All fields must be filled")
            setError(true)
            return
        }

        let data = {...accountState.form};
        delete data.image;
        // console.log(data)
        context.server('updateadmin', data).then( resp => {
            if(resp.status) {
                context.timeouts( accountSetter.accountAlertSuccessSet, false)
                accountSetter.accountSet(data)
                accountSetter.accountAlertSuccessSet(true)
                return
            }
            alert("nothing has changed");
        })

    }

    let changePass = () => {
        setError(false)
        accountSetter.accountAlertSuccessSet(false)
        let data = {
            new: pass[0].current.value,
            conf: pass[1].current.value
        }

        if(data.new.length < 4 || data.conf.length < 4) {
            pass[0].current.className = pass[0].current.className + " is-invalid"
            pass[1].current.className = pass[1].current.className + " is-invalid"
            setError(true)
            setErrMsg("Password must be atleast 4 characters")
            return
        }

        if(data.new !== data.conf) {
            setError(true)
            setErrMsg("New and confirm password did not match");
            return
        }
        
        let info = { pass: data.new, token: accountState.token, id: accountState.id }

        context.server( 'changepass', info ).then( resp => {
            if(resp.status) {
                context.timeouts( accountSetter.accountAlertSuccessSet, false)
                accountSetter.accountSet({token: resp.new_token})
                accountSetter.accountAlertSuccessSet(true)
                pass[0].current.value = ""
                pass[1].current.value = ""
                setEditPass(false)
                return
            }
            
            if(
                resp.data.message === "INVALID_ID_TOKEN" ||
                resp.data.message === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN"
                ) {
                alert(resp.data.message)
                accountSetter.accountClear()
                return
            }
            

        })
    }

    useEffect(() => {
        accountSetter.accountFormSet();
        return () => accountSetter.accountAlertSuccessSet(false);
    }, [])

    // useEffect( () => {

    // }, [])

    return (
        <div  className="mb-5">
            <h2>Account</h2>
            { accountState.alert.success &&
                <div className="alert alert-success alert-dismissible">
                    Update Successful
                    <button 
                    type="button" 
                    onClick={ () => accountSetter.accountAlertSuccessSet(false) }
                    className="btn-close" 
                    aria-label="Close"></button>
                </div>
            }
            { error &&
                <div className="alert alert-danger alert-dismissible">
                   {errMsg}
                    <button 
                    type="button" 
                    onClick={ () => setError(false)} 
                    className="btn-close" 
                    aria-label="Close"></button>
                </div>
            }
            <Form type="account" />
            
            <div style={{ maxWidth: 300 }}>
                <div className="d-grid gap-2 d-flex justify-content-end mt-4">
                    <button className="btn btn-primary d-block" onClick={() => updateInfo()}>Update Info</button>
                </div>
                <div className="lh-1 mt-2">
                    <p className="mb-2">Email</p>
                    <p className="fs-4 border-bottom pb-1">{accountState.form.email || ""}</p>
                </div>
                {!editPass ?
                    <div>
                        <div className="lh-1">
                            <p className="mb-2">Password</p>
                            <p className="fs-4 border-bottom pb-1">******</p>
                        </div>

                        <div className="d-grid gap-2 d-flex justify-content-end mt-4">
                            <button className="btn btn-outline-success d-block" onClick={() => setEditPass(true)}>Update Passwrod</button>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="mb-1" style={{ maxWidth: 300 }}>
                            <label className="form-label mb-1">New Password</label>
                            <input
                                ref={pass[0]}
                                type="password"
                                className="form-control" />
                        </div>
                        <div className="mb-1" style={{ maxWidth: 300 }}>
                            <label className="form-label mb-1">Confirm</label>
                            <input
                                ref={pass[1]}
                                type="password"
                                className="form-control" />
                        </div>
                        <div className="d-grid gap-2 d-flex justify-content-end mt-4">
                            <button className="btn btn-outline-secondary d-block" onClick={() => setEditPass(false)}>Cancel</button>
                            <button className="btn btn-success d-block" onClick={ () => changePass()}>Update</button>

                        </div>
                    </div>
                }

            </div>


        </div>

    )
}

export default withConnect(Account)