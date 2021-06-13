import React, { useContext, useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import Form from './Form'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const PersonAdd = ({history, listSetter, listState, accountSetter}) => {
    
    let context = useContext( GlobalContext )
    let [success, setSuccess] = useState({
        value: false,
        msg: "",
    })
    let [error, setError] = useState({
        value: false,
        msg: ""
    })

    let statusChange = e => {
        listSetter.listViewChange({field: 'status', value: e.target.value})
    }

    let submit = () => {
   
        setError({value: false, msg: ""})

        let invalid = false
        let form = {...listState.view}
        delete form.id

        Object.keys(form).forEach( x => {
            if(form[ x ] === "" || form[ x ] === undefined) invalid = true
        })

        if(invalid) {
            setError({value: true, msg: "All fields must be filled"})
            return
        }

        // console.log(form)

        context.server('personwrite', form).then( resp => {
            if(resp.status) {
                context.timeouts(setSuccess, {value: false, msg: ""})
                setSuccess({value: true, msg: "New person succesfully added"})
                listSetter.listViewClear();
                return;
            }
            if(!resp.status) {
                context.timeouts(setError, {value: false, msg: ""})
                setError({value: true, msg: resp.error})
                if(resp.action === "LOGOUT") accountSetter.accountClear();
                return
            }
        })

        
    }

    useEffect( () => {
        listSetter.listViewClear();
    }, [])

    return (
        <div className="mb-5">
            <h2>Add Person</h2>
            { success.value &&
                <div className="alert alert-success alert-dismissible ">
                    {success.msg}
                    <button className="btn-close" onClick={ () => setSuccess({msg: "", value: false})}></button>
                </div>
            }
            { error.value &&
                <div className="alert alert-danger alert-dismissible ">
                    {error.msg}
                    <button className="btn-close" onClick={ () => setError({msg: "", value: false})}></button>
                </div>
            }
            <Form type="add" success={success.value}/>
            <div style={{ maxWidth: 300 }}>
                <div style={{ maxWidth: 220 }} className="my-2">
                    <label>
                        Marital Status
                        { listState.view.status === "" && <span className="text-danger"> required *</span>}
                    </label>
                    <select 

                    className={"form-select " + (listState.view.status === "" && "is-invalid") }
                    value={listState.view.status} 
                    onChange={ e => statusChange(e)}>
                        <option value="" disabled>-select-</option>
                        <option value="single">Single</option>
                        <option value="married">Married</option>
                        <option value="divorced">Divorced</option>
                        <option value="widowed">Widowed</option>
                        <option value="deceased">Deceased</option>
                    </select>
                </div>

                <div className="d-grid gap-2 d-flex justify-content-end mt-3">
                    <button className="btn btn-outline-secondary d-block" onClick={() => history.goBack()}>Back</button>
                    <button className="btn btn-primary d-block" onClick={ () => submit()}>Submit</button>
                </div>

            </div>
        </div>
    )
}

export default   withConnect(withRouter(PersonAdd))