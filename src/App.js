
import { useContext, useEffect } from 'react';
import { GlobalContext } from './components/GlobalProvider'
import Navbar from './components/Navbar'
import { withConnect } from './components/redux'
import Routings from './components/Routings'

function App({ accountState, accountSetter }) {

  const context = useContext( GlobalContext )

  window.onbeforeunload = function() {
    window.localStorage.auth = JSON.stringify({token: accountState.token, id: accountState.id})
  }

  useEffect( () => {
    // console.log(process.env)
    try {
      let auth = JSON.parse(window.localStorage.auth)
      
      context.server("authenticate", auth).then(resp => {
        if(resp.status) {
          resp.data.logged = true
          resp.data.token = auth.token
          accountSetter.accountSet(resp.data)
        }

        window.localStorage.clear();
      });

    } catch (error) {
      
    }
  }, []);

  return (
    <div>
        <Navbar />
        <div style={{marginBottom: 60}}></div>
        <Routings />
    </div>
  );
}

export default withConnect(App) ;
