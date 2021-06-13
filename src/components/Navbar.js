import React, { useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { withConnect } from './redux'


const Navbar = ({ history, accountState, accountSetter }) => {

    let navbar = useRef(null)
    let navbutton = useRef(null)


    let navToggler = () => {
        // console.log(navbar.current.className)
        if (navbar.current.className.includes("show")) navbutton.current.click()
    }

    let logout = () => {

        accountSetter.accountClear();
        // history.push("/login")
    }

    return (
        <div>
            <nav className="navbar navbar-expand-sm navbar-light bg-light fixed-top">
                <div className="container" onClick={e => e.preventDefault()}>
                    <a className="navbar-brand" href="/">React CRUD</a>

                    {accountState.logged &&
                        <>
                            <button
                                ref={navbutton}
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav" ref={navbar} onClick={() => navToggler()}>
                                <ul className="navbar-nav me-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" onClick={() => history.push("/")} href="/">Home</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" onClick={() => history.push("/list")} href="/">List</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" onClick={() => history.push("/account")} href="/">Account</a>
                                    </li>
                                </ul>

                                <div className="navbar-nav ms-auto">
                                    <div className="nav-item">
                                        <a className="nav-link" onClick={() => logout()} href="/">Logout</a>
                                    </div>
                                </div>
                            </div>
                        </>
                    }

                </div>
            </nav>
        </div>

    )
}

export default withConnect(withRouter(Navbar))