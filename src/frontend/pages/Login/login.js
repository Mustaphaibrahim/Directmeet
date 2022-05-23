import './login.css'
import { useState } from 'react'
import logo from '../../images/Logo.png';
import { Alert } from '../Alert/Alert';
import  axios  from 'axios';
import { DotWave } from '@uiball/loaders'



const Login = (props) => {


   

    const [ log, setLog ] = useState (true);

    const [ userName,setUserName ] = useState ('');
    const [ email,setEmail ] = useState ('');
    const [ password,setPassword ] = useState ('');
    const [ passwordConfirm,setPasswordConfirm ] = useState ('');
    const [ passError,setPassError ] = useState (false);
    const [ logerror,setLogerror ] = useState (false);
    const [ loding,setLoding ] = useState (false);

    
    const [ alertReg, setAlertReg ] = useState (false);
    
    const login = (e) => {

        
        if( email && password ) {
            setLoding(true);
            e.preventDefault()
            const data = { email: email, password: password }
            axios.post('http://localhost:3000/login',data)
            .then((data)=>{
               setLoding(false);
                if( data.data.message  === 'password or email is invalid' )
                {
                    setLogerror(true);
                    localStorage.setItem('token',data.data.token );
                }

                if( data.data.message  === 'success login' )
                {
                    setLogerror(false);
                    props.setLoginOn(true);
                    localStorage.setItem('token',data.data.token );
                    localStorage.setItem('user',JSON.stringify( data.data.user));
                }

              });
              setEmail("");
              setPassword("");
        }
    }

    const submit = (e) => {
        if( userName && email && password && passwordConfirm ) {
            e.preventDefault()
           if(password === passwordConfirm) {
            const data = { username: userName, email: email, password: password}
            axios.post('http://localhost:3000/create/user',data);
              setUserName("");
              setEmail("");
              setPassword("");
              setPasswordConfirm("");
              setPassError(false);
              setAlertReg(true);
             
              setTimeout (()=>{
                setAlertReg(false);
                setLog(true);
              },2000)
           }
           else {
                setPassError(true);
           }
        }
    }
    
    return (
        <div className="login_page">
            
            {
                (alertReg) ?
                <Alert /> 
                :
                null
            }

            <div className="logo_box">
                <div className="logo">
                    <img src={logo}></img>
                </div>
            </div>
            {
                (log) ?
                <form className="login">
                    <h2> Login</h2>
                    <input type="email" name="email" placeholder="E-mail" value={email} required
                    onChange={ (e)=> {
                        setEmail(e.target.value);
                        setLogerror(false);
                        }}
                    />
                    <input type="password" name="password"
                    required placeholder="Password"
                    value={password}
                    onChange={ (e)=> {
                        setPassword(e.target.value);
                        }}
                    />
                       {
                        (logerror) ?
                        <p className="logerror">password or email is invalid</p>
                        :
                        null
                    }
                    
                 
                    <button type="submit"
                    onClick={ (e)=> {login(e)} }
                    >
                        {
                        (loding)?
                        <DotWave 
                        size={47}
                        speed={1} 
                        color="white" 
                        />
                        : 'Login'
                    }
                       
                        </button>
                    <p className="p_registration" 
                    onClick={ ()=> {
                        setLog(false);
                        }}
                    >Registration</p>
                </form>
                :
                <form className="registration">
                    <h2>Registration</h2>
                    <input type="text" name="username" placeholder="User Name"
                    value={userName} required
                    onChange= { (e)=> {
                        setUserName(e.target.value);
                        }}
                    />
                    <input type="email" name="email" placeholder="E-mail"
                    value={email} required
                    onChange={ (e)=> {
                        setEmail(e.target.value);
                        }}
                    />
                    <input type="password" name="password" placeholder="Password" required
                    value={password}
                    onChange={ (e)=> {
                        setPassword(e.target.value);
                        }}
                    />
                    <input type="password" name="password" placeholder="Confirm Password"
                    value={passwordConfirm} required
                    onChange= { (e)=> {
                        setPasswordConfirm(e.target.value);
                        }}
                    />
                    {
                        (passError) ?
                        <p className="passError">Please Confirm Your Password</p>
                        :
                        null
                    }
                    <button type="submit"
                    onClick={ (e)=> {
                        submit(e) 
                        }}
                    >Submit</button>
                    <p className="p_registration"
                    onClick= { ()=> {
                        setLog(true);
                        }}
                    >Login</p>
                </form>
            }
        </div>
    )
    
}

export {Login}