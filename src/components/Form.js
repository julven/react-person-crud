import React, { useContext, useEffect, useRef, useState } from 'react'
import { IMAGE_HOLDER_150, IMG_FOLDER } from './CONSTANTS'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const Form = ({type, accountState, accountSetter, listState, listSetter, success}) => {

    const context = useContext( GlobalContext )
    const imgInput = useRef(null)
    const [form, setForm] = useState({})
    const [viewImage, setViewImage] = useState("")

    const formChange = (field, value) => {
        setForm({ ...form, [ field ]: value })
        if(type==="account" || type==="signup") { 
            accountSetter.accountFormChange({ field, value }) 
            return
        }
        if(type=="add" || type=="edit") {
            listSetter.listViewChange({field, value})
        }
        
    }

    let imageUpload = e => {
        // console.log(e.target.files[0])
        if(e.target.files[0] === undefined) return;
        if(type==="account") {
            context.server('updateimage', {image: e.target.files[0], id: form.id}).then(resp => {
                if(resp.status) {
                    accountSetter.accountSet({image: resp.new_image})
                    accountSetter.accountFormChange({field: "image", value: resp.new_image})
                    formChange('image', resp.new_image)
                    accountSetter.accountAlertSuccessSet(true)
                } 
            })
            return
        }
        if(type==="signup"||type=="add") {
            let reader = new FileReader();
           
            reader.addEventListener('load', function () {
                setViewImage(reader.result)
                // console.log(reader.result)
            })
            reader.readAsDataURL(e.target.files[0])
            type==="signup" && accountSetter.accountFormChange({field: "image", value: e.target.files[0]})
            type=="add" && listSetter.listViewChange({field: 'image', value: e.target.files[0]})
            return
        }
        if(type==="edit") {
            context.server('personupdateimage', {id: form.id, image: e.target.files[0]}).then( resp => {
                if(resp.status) {
                    listSetter.listViewChange({field: "image", value: resp.new_image})
                    setForm({...form, image: resp.new_image})
                    alert("photo successfully updated");
                }
            })
            return
        }

        
    }

    let validate = field => {
        if(form[ field ] === "") return true;
        return false;
    }

    useEffect( () => {
        console.log("form")
        // console.log({success})
        if(success) setViewImage("")
    }, [success])

    useEffect( () => {
        // console.log(form)
        console.log("form")
    }, [form])

    useEffect( () => {
        if(type==="account" || type==="signup") setForm(accountState.form) 
        if(type==="add" || type==="edit") setForm(listState.view)
    //    console.log("test")
        console.log("form")
    }, [accountState.form, listState.view])

    return (

        <div className="row">

            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">

                <div className="d-flex justify-content-center" style={{ maxWidth: 300 }}>
                    <div  style={{ width: 150, height: 150 }} className={validate('image') ? "border border-danger": ""}>
                        {   (type==="account"||type==="edit") &&
                            <img 
                            src={ form.image ? IMG_FOLDER + form.image : IMAGE_HOLDER_150 } 
                            title={ form.image ? IMG_FOLDER + form.image : IMAGE_HOLDER_150 }
                            className="rounded" 
                            style={{width: '100%', height: '100%', overflow: 'hidden'}}/>
                        }
                        {   (type==="signup"||type==="add") &&
                            <img 
                            src={ viewImage || IMAGE_HOLDER_150} 
                            alt={ viewImage || IMAGE_HOLDER_150}
                            className="rounded" 
                            style={{width: '100%', height: '100%', overflow: 'hidden'}}/>
                        }
                        
                    </div>
                    <input type="file" accept="image/*" hidden ref={imgInput} onChange={ e => imageUpload(e)}/>
                </div>
                <div style={{ maxWidth: 300 }} className="d-flex justify-content-center">
                    <button 
                    onClick={() => console.log(imgInput.current.click())}
                    className="btn btn-outline-primary my-2" 
                    style={{ width: 150 }}>
                    { type==="account" || type=="edit" ? "Change" : "Upload" }
                    </button>      
                </div>
                <div className="mb-1" style={{ maxWidth: 300 }}>
                    <label className={"form-label"} >
                        First Name 
                        {validate('fname') && <span className="text-danger"> *required*</span>}
                    </label>
                    <input
                        value={form.fname || ""}
                        onChange={e => formChange('fname', e.target.value)}
                        type="text"
                        className={"form-control " + (validate('fname') && 'is-invalid')}/>
                </div>

                <div className="mb-1" style={{ maxWidth: 300 }}>
                    <label className="form-label">
                        Last Name 
                        {validate('lname') && <span className="text-danger"> *required*</span>}
                    </label>
                    <input
                        value={form.lname || ""}
                        onChange={e => formChange('lname', e.target.value)}
                        type="text"
                        className={"form-control " + (validate('lname') && 'is-invalid')} />
                </div>


                <div className="mb-1" style={{ maxWidth: 220 }}>
                    <label className="form-label">
                        Birthday 
                        {validate('bday') && <span className="text-danger"> *required*</span>}
                    </label>
                    <input
                        value={form.bday || ""}
                        onChange={e => formChange('bday', e.target.value)}
                        type="date"
                        className={"form-control " + (validate('bday') && 'is-invalid')}/>
                </div>

                <label className="form-label">
                    Gender 
                    {validate('gender') && <span className="text-danger"> *required*</span>}
                </label>
                <div>
                    <div className="form-check form-check-inline">
                        <input 
                        checked={ form.gender == "male"}
                        onChange={e => formChange('gender', e.target.value)}
                        className="form-check-input" 
                        type="radio" 
                        name="gender" 
                        value="male" />
                        <label className="form-check-label" htmlFor="inlineRadio1">Male</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input 
                        checked={ form.gender == "female"}
                        onChange={e => formChange('gender', e.target.value)}
                        className="form-check-input" 
                        type="radio" 
                        name="gender" 
                        value="female" />
                        <label className="form-check-label" htmlFor="inlineRadio2">Female</label>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default  withConnect(Form)