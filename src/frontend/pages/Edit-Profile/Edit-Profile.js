import './Edit-Profile.css';
import { useState, useEffect } from 'react';
import { Alert } from '../Alert/Alert';
import  axios  from 'axios';

const Edit_Profile = (props) => {

    const [ userName,setUserName ] = useState ('');
    const [ email,setEmail ] = useState ('');
    const [ confirmEmail,setConfirmEmail ] = useState ('');
    const [ password,setPassword ] = useState ('');
    const [ passwordConfirm,setPasswordConfirm ] = useState ('');

    const [ passError,setPassError ] = useState (false);
    const [ emailError,setEmailError ] = useState (false);

    const [cEmail, setCEmail ] = useState (false);
    const [cPassword, setCPassword ] = useState (false);

    const [alertReg, setAlertReg] = useState (false);

    useEffect(()=>{
        setUserName(props.userInfo.username);
        setEmail(props.userInfo.email);
        setConfirmEmail(props.userInfo.email)
        
    },[]);

    useEffect (() => {
      
        if(password === "") {
            setCPassword (false);
            setPassError(false)
        }
        else {
            setCPassword (true);
        }

    },[email, password])

    useEffect (() => {
        if( email === confirmEmail ) {
            setEmailError(false);
        }
        else {
            setEmailError(true);
        }
        if(password === passwordConfirm) {
            setPassError(false);
        }
        else {
            setPassError(true);
        }

    },[confirmEmail,passwordConfirm ] )


    const submit = (e) => {
        if ( userName && email && confirmEmail )
        {
            e.preventDefault()
           
          const data = { username: userName, email: email,  password: password , confirmEmail:confirmEmail}
          
            axios.post('http://localhost:3000/user/update', data )
            .then(()=>{ 
                localStorage.setItem('user',JSON.stringify( data));
                location.reload();
             })
              console.log(data);
              setUserName("");
              setEmail("");
              setConfirmEmail("");
              setPassword("");
              setPasswordConfirm("");
              setAlertReg(true);
              setTimeout ( ()=> {
                    setAlertReg(false);
              },2000)
        }
    }

    return (
        <div className="edit_profile">
                {
                    (alertReg) ?
                    <Alert />
                    :
                    null
                }
            <form className="edit_profile_form">

                    <h2>Edit Your Profile </h2>
                        <input type="text" name="username" placeholder="User Name"
                            value = { userName } required
                            onChange={ (e)=> {
                            setUserName(e.target.value);
                            }}
                    />
                        <input type="email" name="email" placeholder="E-mail"
                            value = { email } required
                            onChange={ (e)=> {
                            setEmail(e.target.value);
                            setCEmail (true);
                            
                            }}
                    />
                
                   
                        <input type="password" name="password" placeholder="Password" required
                            value = { password }
                            onChange={ (e)=> {
                            setPassword(e.target.value);
                            }}
                    />
                    {
                        (cPassword) ?
                        <input type="password" name="password" placeholder="Confirm Password"
                            value = { passwordConfirm } required
                            onChange = { (e)=> {
                            setPasswordConfirm(e.target.value);
                            }}
                        />
                        :
                        null
                    }
                    {
                        (passError) ?
                        <p className="passError">Please Confirm Your Password</p>
                        :
                        null
                    }
                    
                    <button type="submit"
                        onClick = { (e)=>{ submit(e) } }
                    >Save</button>

                    <button type="button"
                        onClick = { () => {
                        props.setEdit(false);
                        }}
                    >Cancel</button>

                </form>
        </div>
    )
}

export { Edit_Profile }