import React, { useState, useEffect, useContext } from 'react'
import { IMG_FOLDER } from './CONSTANTS'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const Home = ({ accountState, listState }) => {

    let context = useContext(GlobalContext)

    let [list, setList] = useState({})

    useEffect(() => {
        
        context.server('personsummary', {}).then(resp => {
            setList(resp.info)
        })
    }, [])

    return (
        <div  className="mb-5">
            <h2>Home</h2>
            <div className="row">

                <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 ">
                    <div className="d-flex justify-content-center">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th colSpan="2">Account Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>

                                    <td colSpan="2" >
                                        <div className="d-flex justify-content-center">
                                            <div style={{ width: 100, height: 100, overflow: "hidden" }} className="">
                                                <img
                                                className="rounded"
                                                    style={{ width: "100%" }}
                                                    src={IMG_FOLDER + accountState.image}
                                                    title={IMG_FOLDER + accountState.image} />
                                            </div>
                                        </div>

                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">First Name</th>
                                    <td className="text-capitalize">{accountState.fname}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Last Name</th>
                                    <td className="text-capitalize">{accountState.lname}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Birthday</th>
                                    <td className="text-capitalize">{ context.date(accountState.bday) }</td>
                                </tr>
                                <tr>
                                    <th scope="row">Gender</th>
                                    <td className="text-capitalize">{accountState.gender}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
                    <div className="justify-content-center">
                        <div >
                        <table className="table" >
                            <thead>
                                <tr>
                                    <th colSpan="2">List Summary</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Male(s)</th>
                                    <td>{list.males}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Female(s)</th>
                                    <td>{list.females}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Total</th>
                                    <td>{list.total}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table className="table" >
                            <thead>
                                <tr>
                                    <th colSpan="2">Status Summary</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Single</th>
                                    <td>{list.single}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Married</th>
                                    <td>{list.married}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Divorced</th>
                                    <td>{list.divorced}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Widowed</th>
                                    <td>{list.widowed}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Deceased</th>
                                    <td>{list.deceased}</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default withConnect(Home)