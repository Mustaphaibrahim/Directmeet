
import {  Loading , Login , Home } from '../pages/index';
import { useState, useEffect} from 'react';



const App = () => {

const [ loginOn ,setLoginOn ] = useState(false);

const tok = localStorage.getItem('token')

useEffect(()=>{
  if(tok == 'null')
  {
    setLoginOn(false);
  }else if(tok == null)
  {
    setLoginOn(false);
  }
  else{
    setLoginOn(true);
  }

},[tok])


    return(
        <div className="App" >
          
          < Loading/>

          {
            (loginOn)?
            <Home/> 
            :
            <Login setLoginOn={setLoginOn}  /> 
          }
           
          
           
          
       


         

        </div>
    )
}
export default  App ; 