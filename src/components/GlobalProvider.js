import moment from 'moment';
import React, { createContext, useState } from 'react';
import { SERVER } from './CONSTANTS'
import { withConnect } from './redux';


let GlobalContext = createContext(); 
let GlobalProvider = ({ children, accountState, listState }) => {

    const [timer, setTimer] = useState(null);

    let timeouts = (setter, state) => {

        if(timer) clearTimeout(timer)
        let timing = window.setTimeout(() => {
            setter(state)
        }, 8000)

        setTimer(timing);

    }

    let date = (value) => {
        if(value) return moment(value).format("MMMM D, YYYY")
        return "";
    }

    let getBatchList = current => {
        let options = {}
        if(current) options.current = current

        return new Promise( resolve => {
            Object.keys(listState.search).forEach( x => {
                if(x === "search") options[ x ] = listState.search[ x ]
                else if(listState.search[ x ] !== "") options[ x ] = listState.search[ x ]
            })
            server("personreadbatch", options).then(resp => resolve(resp))
        }) 
    }

    let server = ( route, data ) => {
        return new Promise( resolve => {

            let form = new FormData();
            
            Object.keys(data).forEach( x => form.append( x, data[ x ]));

            fetch( SERVER+route, {
                method: "POST",
                headers: {
                    "Auth-Token": accountState.token,
                    "Auth-Id": accountState.id
                },
                body: form
            })
            .then( resp => resp.text())
            .then( resp => {
                // console.log(resp);

                try {
                    let reply = JSON.parse(resp);
                    resolve(reply);
                } catch (error) {
                    resolve({error})
                }
            })
        })
    }

    return (
        <GlobalContext.Provider 
        value={{
            server,
            getBatchList,
            timeouts,
            date
        }}>
            { children }
        </GlobalContext.Provider>
    )

}
GlobalProvider = withConnect(GlobalProvider);

export {
    GlobalProvider,
    GlobalContext
}