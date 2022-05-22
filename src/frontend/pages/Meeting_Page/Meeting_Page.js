import './Meeting_page.css';
import { useState, useEffect, useRef } from 'react';
import  { motion } from 'framer-motion';
import { Chatt } from '../chattPage/chattPage';
import  Peer  from "peerjs";
import { Join } from '../Join/Join';
import { useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss';
const { v4: uuidv4 } = require('uuid');
import {CopyToClipboard} from 'react-copy-to-clipboard';





const roomid = document.location.href.substring(29,1000);

const socket = io();
const peer = new Peer();

let ScreenCall = false
let VideoCall = false
let AudioCall = false


const MeetingPage = (props) => {

  

    const [ camera , setCamera ] = useState(false);
    const [ mic , setMic ] = useState(false);
    const [ screen , setScreen ] = useState(false);
    const [ footer , setFooter ] = useState(false);
    const [ videoBox , setvideoBox ] = useState('');
    const [ pup , setPup ] = useState(false);
    const [ wind , setWind ] = useState('');
    const [ windH , setwindH ] = useState('');
    const [ chat , setChat ] = useState(false);
    const [ meetingLink , setMeetingLink ] = useState(false);
    const [ streamBoxWidth , setStreamBoxWidth ] = useState('100%');
    const [ videoBoxWidth , setSvideoBoxWidth ] = useState('50%');
    const [ userInfo, setUserInfo ] = useState ('');
    const [ loginOn ,setLoginOn ] = useState(false);
    const [ id ,setId ] = useState('')
    const [ room ,setRoom ] = useState('');
    const [ users ,setUsers] = useState([]);
    const [ usersList ,setUsersList ] = useState(false);
    const [ massagesLingth ,setMassagesLingth ] = useState(-1);
    const [ dis, setDis] = useState(true);
    const [ CreatRooms, setCreatRooms] = useState(false);
    const [ RoomsNumber, setRoomsNumber] = useState(['']);
    const [ Rooms, setRooms] = useState([]);
    const [ RoomsLog, setRoomsLog] = useState(false);
    const [ peerId,setPeerId ] = useState('');
    const [ userScreen, setUserScreen] = useState(false);
   
    // const [ ScreenCall, setScreenCall] = useState(false);
    // const [ VideoCall, setVideoCall] = useState(false);
    // const [ AudioCall, setAudioCall] = useState(false);
   
    const [ x, setX] = useState(false);
    const [ peers, setPeers] = useState([]);
    const [ peers2, setPeers2] = useState([]);

    const cameraRef = useRef();
    const audioRef = useRef();
    const screenRef = useRef();
    const screen1Ref = useRef();

 
    const navigate = useNavigate();
    
    const tok = localStorage.getItem('token')

    if(dis === false)
    {
        setTimeout (()=>{
            const user = JSON.parse(localStorage.getItem('user'));
            setUserInfo(user);
        },100);
    }
   
    useEffect(()=>{
        console.log(AudioCall);
        console.log(ScreenCall);
    },[AudioCall,ScreenCall])
  
    useEffect(()=>{

        peer.on('open', function(){
            socket.emit('peer', peer.id );
            setPeerId(peer.id)
        });

        socket.on('peer', (newpeer) => {
            setPeers(newpeer);
        });
        
        

     if(tok == null)
      {
        setLoginOn(false);
      }
      else{
        setLoginOn(true);
        setTimeout (()=>{
            const user = JSON.parse(localStorage.getItem('user'));
            setUserInfo(user);
        },100)
      }
    
    },[])


   
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        const UserData = { userName:user.username }
        socket.emit('join-room', roomid, JSON.stringify(UserData) )

        socket.on('user-disconnected', (peers) => {
            setPeers(peers);
        });
        socket.on('camera', (peers) => {
            setPeers(peers)
          
        });
        socket.on('cameraStop', (peers) => {
            setPeers(peers)
        });
        socket.on('mic', (peers) => {
            setPeers(peers)
            ScreenCall=false;
            VideoCall = false;
            AudioCall = true;
            
        });
        socket.on('micStop', (peers) => {
            setPeers(peers)
        });
        socket.on('videoCall', (t) => {
            ScreenCall=false;
            VideoCall = true;
            AudioCall = false;
        });
        socket.on('screenCall', () => {
            ScreenCall=true;
            VideoCall = false;
            AudioCall = false;
        });

        socket.on('screenStop', (msg) => {
            setUserScreen(false);
            setStreamBoxWidth('100%');
            const x1 = document.querySelector('.home_main');
             if(x1.clientWidth < 600)
             {
                 setSvideoBoxWidth('100%');
             }else{
                 setSvideoBoxWidth('50%');
             }
        });

        peer.on('call', function(call) {
        
                call.answer(); 
                console.log(ScreenCall);
                if(ScreenCall)
                {
                    call.on('stream', function(remoteStream) {
                        setUserScreen(true);
                        screen1Ref.current.srcObject = remoteStream;
                        const x1 = document.querySelector('.home_main');
                        if( x1.clientWidth < 600  )
                        {
                            setStreamBoxWidth('100%');
                            setSvideoBoxWidth('50%');
                        }else {
                            setStreamBoxWidth('20%');
                            setSvideoBoxWidth('100%');
                        }
                        const x = document.querySelector('.videoBox');
                        setvideoBox((x.clientWidth)/100*71.5)
                    });
                }
                  
                if(VideoCall)
                {
                    call.on('stream', function(remoteStream) {
                        const x = document.getElementById('streamBox');
                        for (let i= 0; i < x.children.length; i++) {
                            x.children[i].children[0].textContent
                            if( x.children[i].children[0].textContent == call.peer  )
                            {
                                x.children[i].children[1].srcObject=remoteStream;
                            }
                        }
                    })
                }

                if(AudioCall)
                {
                    call.on('stream', function(remoteStream) {
                        const x = document.getElementById('streamBox');
                        for (let i= 0; i < x.children.length; i++) {
                            x.children[i].children[0].textContent
                            if( x.children[i].children[0].textContent == call.peer  )
                            {
                                x.children[i].children[2].srcObject=remoteStream;
                                console.log(x.children[i].children[2]);
                            }
                        }
                    })
                }
                
        });

      

    },[]);

  
 

    useEffect(()=>{
       (dis)?'':socket.emit('join-room', roomid, id , userInfo.username);
    },[dis]);

   
    const  screenOn =  ()=>{
       
        socket.emit('screen');
        navigator.mediaDevices.getDisplayMedia ({ video:true,audio:true })
        .then((stream)=>{ 
            setScreen(true);
            screenRef.current.srcObject = stream;
            peers.map((userPeer)=>{
                if(peerId != userPeer.peerId)
                {
                    call = peer.call(userPeer.peerId, stream);
                    console.log(userPeer.peerId);
                }
            });
          
            const x1 = document.querySelector('.home_main');
            if( x1.clientWidth < 600  )
            {
                setStreamBoxWidth('100%');
                setSvideoBoxWidth('50%');

            }else {
                setStreamBoxWidth('20%');
                setSvideoBoxWidth('100%');
            }
            const x = document.querySelector('.videoBox');
            setvideoBox((x.clientWidth)/100*71.5)
        });
    
    }

    const  screenStop = ()=>{
        setScreen(false);
        socket.emit('screenStop')
        tracks.forEach((track) =>{
            if(track.kind === 'audio')
            {
                track.stop();
            }
            if(track.kind === 'video')
            {
                track.stop();

            }
           setStreamBoxWidth('100%');
           const x1 = document.querySelector('.home_main');
            if(x1.clientWidth < 600)
            {
                setSvideoBoxWidth('100%');
            }else{
                setSvideoBoxWidth('50%');
            }
        });
    }
    const cameraOn = () => { 
        socket.emit('camera',peerId)
        navigator.mediaDevices.getUserMedia({ video:{ width:'100%'} })
        .then((stream)=>{ 
            setCamera(true); 
            cameraRef.current.srcObject = stream ;
            peers.map((userPeer)=>{
                if(peerId != userPeer.peerId)
                {
                    call = peer.call(userPeer.peerId, stream );
                }
            });

        });
    }
    const  videoStop = ()=>{
        socket.emit('cameraStop',peerId)
        // const tracks = cameraRef.current.srcObject.getTracks();
        // tracks.forEach((track) =>{
        //     if(track.kind === 'video')
        //     {
        //         track.stop();
        //     }});
    }
    
    const audioOn = () => { 
        socket.emit('mic',peerId)
        navigator.mediaDevices.getUserMedia({ audio:true })
        .then((stream)=>{ 
            setMic(true);
            // audioRef.current.srcObject = stream
            peers.map((userPeer)=>{
                if(peerId != userPeer.peerId)
                {
                    call = peer.call(userPeer.peerId, stream );
                }
            });
        });
    }
   
    const  audioStop = ()=>{
        socket.emit('micStop',peerId)
        // const tracks = audioRef.current.srcObject.getTracks();
        // tracks.forEach((track) =>{
        //     if(track.kind === 'audio')
        //     {
        //         track.stop();
        //     }});
    }


    window.addEventListener('resize', ()=>{
            const x = document.querySelector('.videoBox')
            if(camera == false) 
            {
                setwindH( `${x.clientWidth/100*76.5}px`)
               
            }
           
         
    });

    setTimeout(()=>{
        const x = document.querySelector('.videoBox');
        if(camera == false) 
        {
            setwindH( `${x.clientWidth/100*76.5}px`);
            setWind( x.clientWidth )
        }
    },10)
        
  


    return (
        <div className="meeting_page" 
            onClick={ ()=>{
                if(screen || x1.clientWidth < 600 )
                {
                    (footer)?
                    setFooter(false)
                    :setFooter(true);
                }
            }}
            onMouseMove={(e)=>{ 
                if(screen)
                {
                    if(  e.clientY > windH-100  )
                    {
                        setFooter(true);
                    }
                    if(  e.clientY < windH-290  )
                    {
                        setFooter(false);
                    }

                }else{
                    setFooter(true);
                }
               
            }}>
            {
                (loginOn)?'':<div className='logo logoJoin' ></div>
            }
            
            {
                (loginOn)?'':<Join setDis={setDis} dis={dis} />
            }
             
           {
               (meetingLink)?
               <div className="meetingLink" > 
               <i class="fa-solid fa-xmark" title='exit' onClick={()=>{ setMeetingLink(false) }} ></i>
              
               <p> Meeting Link </p>
               <p>{document.location.href.substring(22,1000)} 
               <CopyToClipboard text={document.location.href.substring(0,1000)}>
               <i class="fa-regular fa-clone" title='copy link' ></i>
               </CopyToClipboard>
               
               </p>
               <p> Meeting ID </p> 
               <p>{document.location.href.substring(29,1000)} 
               <CopyToClipboard text={document.location.href.substring(29,1000)}>
               <i class="fa-regular fa-clone" title='copy link' ></i> 
               </CopyToClipboard>
              
               </p>
               </div>
               :''
           }
               
            { 
                
                (userScreen)?
                <div className="screenBox" >
                <video id='videoScreen' className='videoScreen' ref={screen1Ref}   autoPlay ></video>
                
                </div>
                :null
            }
            { 
            
                (screen)?
                <div className="screenBox" >
                
                <video id='videoScreen' className='videoScreen' ref={screenRef}   autoPlay ></video>
                
                </div>
                :null
            }
        

            <div id='streamBox' className="streamBox" style={{ width: streamBoxWidth ,height:(screen || userScreen)?'95%' :'84%' }} >

                {
                    peers.map((peer)=>{
                        
                        return<div className="videoBox" style={{width: (screen || userScreen )?'100%':(peers.length <= 2 )? '40%' : (peers.length <= 3)? '30%': '20%',height:windH-50 }}> 
                        <p style={{display:'none' }} >{peer.peerId}</p>
                        {
                            (peer.cam)?
                            <video className='video' ref={cameraRef} autoPlay >  </video>
                            : 
                            <div className="videoStopBox" style={{height:windH}} >
                                <div className="userImgVideo" > {peer.userInfo.userName.charAt(0).toUpperCase() } </div>
                            </div>
                        }
                       <audio  ref={audioRef} autoPlay></audio>
                       <div  className='userInfo'  > {peer.userInfo.userName}
                       {
                           (peer.mic)?
                            ''
                           :<i className="fa-solid fa-microphone-slash"  ></i>
                       }
                       
                       </div>
                       
                    </div>
                    })

                }
            
               
         
            </div>

           <Chatt dis={dis} chat={chat} setChat={setChat} id={id} massagesLingth={massagesLingth} room={room} setMassagesLingth={setMassagesLingth}  />
       
            <motion.div className="footer"
                animate={{y: (footer)?0 : '73px' }}
                transition={{ duration:0.5 }}
             
            >

                {
                    (camera)?
                    <i className="fa-solid fa-video" onClick={()=>{ videoStop(); setCamera(false) }}  ></i>
                    :
                    <i className="fa-solid fa-video-slash" style={{ backgroundColor:'#f15454'}} onClick={()=>{ cameraOn();  }} ></i>
                }
                
                {
                    (mic)?
                    <i className="fa-solid fa-microphone" onClick={()=>{ audioStop(); setMic(false) }} ></i>
                    :
                    <i className="fa-solid fa-microphone-slash" style={{ backgroundColor:'#f15454'}} onClick={()=>{ audioOn(); }} ></i>
                }
                {
                    (screen)?
                    <i class="fa-solid fa-xmark" title='stop screen sharing' onClick={()=>{screenStop()}}></i>
                    :<i className="fa-solid fa-display"  title='screen sharing' onClick={()=>{ (userScreen)? alert("You can't screen sharing now ..!!"):screenOn()}}></i>

                }
                
                <i className="fa-solid fa-ellipsis-vertical"
                    onClick={()=>{
                       (pup)?
                       setPup(false)
                       :
                       setPup(true);
                    }}
                ></i>
              
                {
                    (pup)?
                    <div className="pup" 
                        onMouseOut={()=>{
                            if(screen)
                            {
                                setFooter(false);
                            }
                        }}
                        onMouseMove={()=>{
                            if(screen)
                            {
                                setFooter(true);
                            }
                        }}
                    >
                         <i class="fa-solid fa-link" onClick={()=>{ 
                             (meetingLink)?setMeetingLink(false)
                             :setMeetingLink(true)
                              
                             }} > <snap>Meeting Link </snap></i>
                       
                          <i class="fa-solid fa-arrow-right-from-bracket"
                          onClick={()=>{
                            navigate(`/`);
                            location.reload();
                          }}
                          > <snap>Close Meeting  </snap> </i>
                        
                    </div>
                    :null
                }
                <i className="fa-solid fa-comment-dots" 
                    onClick={()=>{
                        (chat)?
                        setChat(false):
                        setChat(true);
                    }} 
                ></i>
                {
                    (massagesLingth >= 1)?
                    (chat)?
                    setMassagesLingth(0)
                    :
                    <p className='massagesNum' >{massagesLingth}</p>
                    :''
                }
                
                
            </motion.div>
           
        </div>
    )
}

export { MeetingPage  , socket}