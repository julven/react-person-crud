import React, { useState, useEffect, useContext, useRef } from 'react'
import { useParams, withRouter } from 'react-router'
import { IMG_FOLDER } from './CONSTANTS'
import { GlobalContext } from './GlobalProvider'
import ListTableModal from './ListTableModal'
import { withConnect } from './redux'

const ListTable = (props) => {

    let params = useParams()
    let context = useContext(GlobalContext)
    let modal = useRef()
    let { history, listState, listSetter, parent } = props
    let [preview, setPreview] = useState({})

    let navigate = (to) => {

        let { page } = listState
        let { current } = page
        // console.log(to)
        if(to ==="next" &&  page.current < page.total ) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
           getBatchList(current+1)
            history.push("/list/"+(Number(current)+1))
            return
        }
        if(to === "prev" && page.current > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
             getBatchList(current-1)
            history.push("/list/"+(Number(current)-1))
            return
        }
    }

    let getBatchList = (current) => {

        context.getBatchList(current).then(resp => {
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

    let deleting = id => {
        let conf = window.confirm("confirm delete this person with id "+id+"?")
        if(conf) {
            // console.log({id})
            context.server('persondelete', {id}).then(resp => {
                if(resp.status) {
                    context.timeouts(parent.setSuccess, {value: false, msg: ""})
                    let current = null
                    if(params.page && Number(params.page >= 0)) current = params.page
                    getBatchList(current)
                    parent.setSuccess({value: true, msg: "person with id "+id+" successfully deleted"})
                    return
                }
                if(!resp.status) {
                    alert(resp.error)
                    return
                }
            })
            return
        }
    }

    let moreInfo = (e, x) => {
        e.preventDefault();
        setPreview(x)
        modal.current.click()
    }

    useEffect(() => {
        // if(params.page) console.log({current: params.page})
        // console.log("list table")
    }, [params.page])

    useEffect(() => {
        // console.log(listState.page)
        // console.log("list table")
    }, [listState.page])

    useEffect(() => {

        let current = null
        if(params.page && Number(params.page >= 0)) current = params.page
        context.getBatchList(current).then(resp => {
            if (resp.status) {
                listSetter.listSet(resp.list)
                listSetter.listSetPage(resp.page)
                return
            }
        })
        
    }, [])

    


     if( listState.list.length > 0 ) return (
        <div className="container">
            { listState.list.map(x => (
                <div className="row border p-3 my-2" style={{ maxWidth: 500 }} key={x.id}>
                    <div className="col-12 col-sm-4 d-flex justify-content-center mb-2">
                        <div style={{ width: 100, height: 100 }}>
                            <img src={IMG_FOLDER + x.image} title={IMG_FOLDER + x.image} style={{ width: "100%", height: "100%" }}></img>
                        </div>
                    </div>
                    <div className="col-12 col-sm-8">
                        <div className="lh-1">
                            <p className="mb-2">Name : <span className="fw-bold text-capitalize">{x.fname} {x.lname}</span></p>
                            <p className="mb-2">Gender : <span className="fw-bold  text-capitalize">{x.gender}</span></p>
                            <p className="mb-2">ID No.: <span className="fw-bold text-capitalize">{x.id}</span></p>
                            <a href="/" onClick={ e => moreInfo(e, x)}>more...</a>
                        </div>
                        <div className="d-grid gap-2 d-flex justify-content-end">

                            <button className="btn btn-outline-danger d-block" onClick={() => deleting(x.id)}>Delete</button>
                            <button className="btn btn-primary d-block" onClick={() => history.push("/personedit/" + x.id)}>Update</button>
                        </div>
                    </div>
                </div>
            ))

            }
            <nav className="d-flex justify-content-center" style={{ maxWidth: 500 }}>
                <ul className="pagination pagination" onClick={e => e.preventDefault()}>
                    <li className="page-item"><a className="page-link" href="/"  onClick={ () => navigate('prev')}>{"<"}</a></li>
                  
                    <li className="page-item disabled">
                        <span className="page-link ">
                            {listState.page.current + 1} / {listState.page.total}
                        </span>
                    </li>
                    
                    <li className="page-item"><a className="page-link" href="/" onClick={ () => navigate('next')}>{">"}</a></li>
                </ul>
            </nav>
            <ListTableModal parent={{modal, preview}} />
        </div>
    )

    if( listState.list.length === 0 ) return (
        <div className="alert alert-danger my-3" style={{width: 500}}>
            No result for "{listState.search.search}"
        </div>
    )
}

export default withConnect(withRouter(ListTable))