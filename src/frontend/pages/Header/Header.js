
import './Header.css'
import logo from '../../images/Logo.png';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit_Profile } from "../Edit-Profile/Edit-Profile"
import  axios  from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

const Header = ()=> {

    const [open, setOpen] = useState(false);
    const [edit, setEdit] = useState(false);
    const [userInfo,setUserInfo] = useState('');
    const [ imgFile , setImgFile ] = useState ('');
    const [ imgSrc ,setImgSrc ] = useState ('');
    const [ ShadowColor , setShadowColor ]= useState ('blue');
    const [profilePic,setProfilePic] = useState(false);
    const [uploadFile,setUploadFile] = useState('');
    


    const navigate = useNavigate();

    useEffect(()=>{
        const user = JSON.parse( localStorage.getItem('user'));
        user.img=imgSrc
        localStorage.setItem('user', JSON.stringify(user))
    },[imgSrc])

    useEffect(()=>{
      const user = JSON.parse( localStorage.getItem('user'));
      
      if(user == 'null')
    {
        setUserInfo('');
    }else{
        setUserInfo(user);
    }
 
    setTimeout (()=>{
        axios.post('http://localhost:3000/img',{email: user.email})
        .then((data)=>{
            setImgSrc(data.data.img);
        })

    },10)
      
        
    },[])

    const Logout = () => { 
        axios.post('http://localhost:3000/user/logout')
        .then((data)=>{ 
            
            if(data.data.message === 'user logged out')
            {
                localStorage.setItem('token', 'null');
                localStorage.setItem('user','null');
                navigate(`/`);
                location.reload();
                
            }
        });
    }
    const imgUpload = () => {

        const x = document.querySelector('.upload_pic');
        if(x != null  )
        {
            x.addEventListener('change',(e)=>{
                const openFile = function(file) {
                    const input = file.target;
                    const reader = new FileReader();
                    reader.onload = function(){
                    const dataURL = reader.result;
                    setImgSrc(dataURL)
                    const data = {confirmEmail:userInfo.email ,  buffer:dataURL, originalname:x.files[0].name , mimetype:x.files[0].type  }

                        axios.post('http://localhost:3000/uploadphoto',data)
                        .then((e)=>{
                            console.log('img updated .. ');
                        })
                    };
                    reader.readAsDataURL(input.files[0]);
              };
              openFile(e)

            })

        }
     
    }




    return (
        <>
        <div className="Header_main" >
            
                <div className="logo">
                    <img src={logo}></img>
                </div>
                <div className="user_profile"
                style={{ backgroundImage:`url(${imgSrc})`}}
                    onClick={()=> {
                        (open)? setOpen(false): setOpen(true);
                        }}> 
                        {
                            ( imgSrc == null || imgSrc == '' )?
                              (userInfo != '' && userInfo != 'null' )?userInfo.username.charAt(0).toUpperCase()
                            :''  
                            :
                            ''
                        }
                       
                            </div>
        </div>

        <motion.div className="profile_window"
            initial={{x:0}}
            animate={{x:(open)? '-450px' : 0}}
            transition={{duration:0.6}} 
        >
                
            {
                (edit) ?
                <Edit_Profile userInfo={userInfo} setEdit={setEdit}/>
                :
                <>
                <h2>Profile</h2> 
                <div className="user_profile_box">

                    <div className="user_profile_big"
                    style={{ backgroundImage:`url(${imgSrc})`}}
                    onMouseOver={(e)=>{
                        setProfilePic(true);
                        imgUpload()
                    }}
                    onMouseLeave={()=>{
                        setProfilePic(false);
                    }}>
                        {
                            ( imgSrc == null || imgSrc == '' )?
                              (userInfo != '' && userInfo != 'null' )?userInfo.username.charAt(0).toUpperCase()
                            :''  
                            :
                            ''
                        }
                        
                    {
                        (profilePic) ?
                        <>
                        <input type='file' title=''  name="testImage" accept=".jpg, .jpeg, .png" multiple className="upload_pic"
                        
                        />
                        <div className="user_profile_two">
                            <i class="fas fa-camera"></i>
                            Change <br/> Profile <br/> Picture
                        </div>
                        </>
                        :
                        null
                    }
                    </div>
                    
                </div>

                <div className="user_profile_info_box">
                    <p className="user_profile_name">
                        { (userInfo != '' && userInfo != 'null')? userInfo.username :'' }
                        </p>
                    <p className="user_profile_email">
                        { (userInfo != '' && userInfo != 'null')? userInfo.email : '' }
                        </p>
                    <button class="btn-edit_profile"
                    onClick={()=>{
                        setEdit(true)
                    }}
                    >Edit profile</button>
                    <button
                    onClick={()=> {
                        const user = JSON.parse( localStorage.getItem('user'));
                        user.img=''
                        localStorage.setItem('user', JSON.stringify(user))
                        const data = { Email:userInfo.email}
                        axios.post('http://localhost:3000/DeleteProfilePhoto',data)
                        location.reload();
                    }}
                     > Delete Profile Photo </button>
                    <button 
                        onClick={()=> {
                            Swal.fire({
                                title: 'Are you sure, you want to Delete your Account!! ?',
                                showCancelButton: true,
                                confirmButtonText: 'Delete',
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    const data = { Email: userInfo.email}
                                    localStorage.setItem('token','null' );
                                    localStorage.setItem('user','null');
                                    axios.post('http://localhost:3000/DeleteAccount',data)
                                    navigate(`/`);
                                    location.reload();
                                } 
                              })
                                const x =  document.querySelector('.swal2-popup')
                                    x.style.backgroundColor = '#000000a1';
                                    x.style.borderRadius ='20px';
                                    x.style.color ='white';
                        
                        }}
                    >Delete Account</button>
                </div>

                <div className="profile_line"></div>

                <h3 onClick={()=>{Logout()  }} >Logout</h3>
          </>

            }
            
            

        </motion.div>
        </>
        
    )
}

export { Header }