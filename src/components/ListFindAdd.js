import React, { useState, useEffect, useContext } from 'react'
import { withRouter } from 'react-router'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'


const ListFindAdd = ({ history, listSetter, listState }) => {

    let context = useContext( GlobalContext )
    let [showOption, setShowOption] = useState(false)

    let searchChange = (field, value) => {
        listSetter.listSearchChange({field, value})
    }
    let search = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // console.log({options: listState.search})
        
        history.push("/list")

        context.getBatchList().then( resp => {
            if (resp.status) {
                listSetter.listSet(resp.list)
                listSetter.listSetPage(resp.page)
                return
            }
            if (!resp.status) {
                listSetter.listSet([])
                return
            }
        })
    }

    useEffect( () => {
        // console.log(listState.search)
        // console.log("list find add")
    }, [listState.search])

    return (
        <div style={{ maxWidth: 500 }}>
            <div className="d-flex gap-2">
                <div className="flex-grow-1">
                    <div className="input-group">
                        <input 
                        value={ listState.search.search }
                        onChange={ e => searchChange('search', e.target.value) }
                        type="text" 
                        className="form-control" 
                        placeholder="search..." />
                        <button 
                        onClick={ () => setShowOption(!showOption)}
                        title="options" 
                        className="btn btn-outline-secondary" 
                        type="button"><i className="bi bi-list-task"></i></button>
                        <button className="btn btn-outline-primary" onClick={ () => search()} type="button">Find</button>
                    </div>
                </div>

                <div className="d-flex justify-content-end">
                    <button className="btn btn-success " onClick={() => history.push("/personadd")}>Add</button>
                </div>
            </div>
            { showOption &&
                <div className="row border m-1 p-2">
                    <div className="d-flex" onClick={e => e.preventDefault()}>
                        <p className="mb-0 fw-bold flex-grow-1">Search Options</p>
                        <a href="/" title="close" onClick={ () => setShowOption(false)}><i className="bi bi-x-lg"></i></a>
                    </div>

                    <div className="col-6 col-sm-4">
                        <small>Gender</small>
                        <select 
                        className="form-select" 
                        value={listState.search.gender} 
                        onChange={ e => searchChange('gender', e.target.value)}>
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>

                        </select>
                    </div>
                    <div className="col-6 col-sm-4">
                        <small>Name</small>
                        <select 
                         value={listState.search.name} 
                         onChange={ e => searchChange('name', e.target.value)}
                        className="form-select" >
                            <option value="">All</option>
                            <option value="fname">First Name</option>
                            <option value="lname">Last Name</option>
                        </select>
                    </div>
                    <div className="col-6 col-sm-4">
                        <small>Status</small>
                        <select 
                         value={listState.search.status} 
                         onChange={ e => searchChange('status', e.target.value)}
                        className="form-select" >
                            <option value="">All</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                            <option value="divorced">Divorced</option>
                            <option value="widowed">Widowed</option>
                            <option value="deceased">Deceased</option>

                        </select>
                    </div>
                </div>
            }
            <small>clear search box and click find to reset</small>

        </div>

    )
}

export default  withConnect(withRouter(ListFindAdd))