import './Home.css'
import { Header } from '../Header/Header';
import { useState , useEffect} from 'react';
import { MeetingPage } from '../Meeting_Page/Meeting_Page';
import { BrowserRouter , Route , Routes ,Link ,useNavigate } from 'react-router-dom';
import { uuid } from 'uuidv4';



const Home = ()=>{

  
    const [ loginOn ,setLoginOn ] = useState(false);
    const navigate = useNavigate();


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

    return (
        <>
        <div className="home_main">
            {
                (loginOn)?
                <Header />
                :''
            }
        
        <MeetingPage/>
        </div>
        </>
    )
}

export { Home }