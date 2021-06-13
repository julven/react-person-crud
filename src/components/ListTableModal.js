import React, { useContext } from 'react'
import { IMAGE_HOLDER_150, IMG_FOLDER } from './CONSTANTS'
import { GlobalContext } from './GlobalProvider'
import { withConnect } from './redux'

const ListTableModal = (props) => {

    let context = useContext( GlobalContext )
    let { preview, modal } = props.parent

    return (
        <div className="mt-3">
            <button
                type="button"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                hidden ref={modal} />

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Person Information</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body justify-content-center d-flex">
                            <table className="table" style={{maxWidth: 300}}>
                                <tbody>
                                    <tr>
                                        <td colSpan="2" >
                                            <div className="d-flex justify-content-center">
                                                <div style={{ width: 150, height: 150, overflow: 'hidden' }} className="mb-3">
                                                    <img
                                                        className="rounded"
                                                        style={{ width: "100%" }}
                                                        src={IMG_FOLDER + preview.image || IMAGE_HOLDER_150}
                                                        title={IMG_FOLDER + preview.image || IMAGE_HOLDER_150} />
                                                </div>
                                            </div>

                                        </td>
                                    </tr>
                                    <tr>
                                        <th scope="row ">First Name</th>
                                        <td className=' text-capitalize'>{preview.fname}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Last Name</th>
                                        <td className=' text-capitalize'>{preview.lname}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Birthday</th>
                                        <td className=' text-capitalize'>{context.date(preview.bday)}</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">Gender</th>
                                        <td className=' text-capitalize'>{preview.gender}</td>
                                    </tr>

                                    <tr>
                                        <th scope="row">Marital Status</th>
                                        <td  className=' text-capitalize'>{preview.status}</td>
                                    </tr>

                                    <tr>
                                        <th scope="row">ID number</th>
                                        <td>{preview.id}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-bs-dismiss="modal">Close</button>

                        </div>
                    </div>
                </div>
            </div>
        </div >

    )
}

export default withConnect(ListTableModal)