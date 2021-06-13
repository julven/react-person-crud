import React, { useContext, useEffect, useState } from 'react'
import { useParams, withRouter } from 'react-router'
import Form from './Form'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const PersonEdit = ({history, listSetter, listState, accountSetter}) => {

    let params = useParams()
    let context = useContext( GlobalContext )
    let [success, setSuccess] = useState({
        value: false,
        msg: "",
    })
    let [error, setError] = useState({
        value: false,
        msg: ""
    })

    let submit = () => {

        setError({value: false, msg: ""})

        let invalid = false
        let form = {...listState.view}

        Object.keys(form).forEach( x => {
            if(form[ x ] === "" || form[ x ] === undefined) invalid = true
        })

        if(invalid) {
            setError({value: true, msg: "All fields must be filled"})
            return
        }

        // console.log(listState.view)

        context.server('personupdate', form).then( resp => {
            if(resp.status) {
                context.timeouts(setSuccess, {value: false, msg: ""})
                setSuccess({value: true, msg: "person succesfully updated"})
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

    // useEffect( () => {
    //     console.log(success)
    //    
    // }, [success])

    // useEffect( () => {
    //     console.log(error)
    //    
    // }, [error])

    useEffect(() => {

        listSetter.listViewClear()

        if(params.id) {
            context.server("personread", {id: params.id}).then(resp => {
                if(resp.status) {
                    // console.log(resp.data)
                    listSetter.listViewSet(resp.data)
                    return
                }
                if(!resp.status) {
                    history.push("/list")
                    return
                }

            })
        }
    },[])

    return (
        <div  className="mb-5">
            <h2>Edit Person</h2>
            {   success.value &&
                <div className="alert alert-success alert-dismissible">
                    {success.msg}
                    <button className="btn-close" onClick={ () => setSuccess({value: false, msg: ""})}></button>
                </div>
            }
             {   error.value &&
                <div className="alert alert-danger alert-dismissible">
                    {error.msg}
                    <button className="btn-close" onClick={ () => setError({value: false, msg: ""})}></button>
                </div>
            }
            <Form type="edit"/>
            <div style={{ maxWidth: 300 }}>
                <div style={{ maxWidth: 220 }} className="my-2">
                    <label>Marital Status</label>
                    <select 
                    className="form-select" 
                    value={listState.view.status} 
                    onChange={ e => listSetter.listViewChange({field: 'status', value: e.target.value})} >
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

export default   withConnect(withRouter(PersonEdit))