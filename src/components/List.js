import React, { useState, useEffect, useContext } from 'react'
import ListTable from './ListTable'
import ListFindAdd from './ListFindAdd'
import { GlobalContext } from './GlobalProvider'

const List = () => {

    let context = useContext( GlobalContext )

    let [success, setSuccess] = useState({
        value: false,
        msg: ""
    })


    return (
        <div  className="mb-2">
            <h2>List</h2>
            {   success.value &&
                <div className="alert alert-success alert-dismissible">
                    {success.msg}
                    <button className="btn-close" onClick={ () => setSuccess({value: false, msg: ""})}></button>
                </div>
            }
            <ListFindAdd />
            <ListTable parent={{success, setSuccess}}/>
            
        </div>

    )
}

export default List