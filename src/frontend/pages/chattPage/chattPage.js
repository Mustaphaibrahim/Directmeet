import  { motion } from 'framer-motion';
import './chatt.css';
import { useState, useEffect } from 'react';
import axios from 'axios'
import fileDownload from 'js-file-download';
import { socket } from '../Meeting_Page/Meeting_Page'; 
import imageCompression from 'browser-image-compression';
import Picker from 'emoji-picker-react';


const Chatt = (props) => { 

    const [onDragOver, setOnDragOver ] = useState (true);
    const [messages, setMessages] = useState ([]);
    const [userInfo, setUserInfo] = useState ('');
    const [emoji, setEmoji] = useState (false);
    const [ textType, setTextType ] = useState ('');
    const [ sendFile ,setSendFile  ] = useState ('');
    
    

    useEffect(()=>{
        socket.on('massage', (msg) => {
            messages.push(msg);
            setMessages([...messages]);
            props.setMassagesLingth( props.massagesLingth + 1 );
        });

    },[])

    useEffect(()=>{
            props.setMassagesLingth( props.massagesLingth + 1 );
    },[messages])
  
    const onEmojiClick = (event, emojiObject) => {
        setTextType(textType+emojiObject.emoji)
    };
    
    const dragAndDropUpload =   (file) => {
        
        if(file.target.files[0].size/1024 > 900)
        {
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            }
           
            const compressedFile =  imageCompression(file.target.files[0], options)
            .then((e)=>{
                console.log(e instanceof Blob);
                const input = e;
                const reader = new FileReader();
                reader.onload = function(){
                const dataURL = reader.result;
                console.log(e);
                const data = {
                    name: e.name,
                    type: e.type,
                    buffer: dataURL,
                }
                setSendFile(data)
                };
                reader.readAsDataURL(e);
            })

        }else{
            const input = file.target;
            const reader = new FileReader();
            reader.onload = function(){
            const dataURL = reader.result;
            console.log(file.target.files[0]);
            const data = {
                name: file.target.files[0].name,
                type: file.target.files[0].type,
                buffer: dataURL,
            }
            setSendFile(data)
            };
            
            reader.readAsDataURL(input.files[0]);

        }
  
    };

    const Download = (url, filename) => {
        axios.get(url, {
            responseType: 'blob',
        })
        .then((res) => {
            fileDownload(res.data, filename)
        })
    };

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('user'));
        setUserInfo(user);
    },[])

    const date = new Date();
            
    return(
        <motion.div className="chatBox"
        style={{height: (props.dis)?'100%' : '100%'}}
        animate={{x: (props.chat)? 0 : '700px'}}  >
            <div className="icoBox" >
            <i class="fa-solid fa-up-right-from-square"
            onClick={()=>{
                window.open('http://localhost:3000/chatt')
            }}
            ></i>
            <i class="fa-solid fa-xmark" onClick={()=>{ props.setChat(false) }} ></i>
            </div>
            {
                    (emoji)?
                    <>
                    <Picker onEmojiClick={onEmojiClick} pickerStyle={{ width: '90%', backgroundColor:'#ffffff',border:'none',boxShadow:'none',position:'absolute',bottom:'60px',zIndex:'2000',left:'5%' }} />
                    </>
                    :
                    null
            }
            <ul className="chat-list">
                {
                    messages.map((e)=>{
                        return <li id="chat-li">
                            <div className="chat-profile-main">
                            <div className="chat-profile-pic"
                                style={{ backgroundImage:`url(${e.img})`  }
                                }>
                                    {
                                        (e.img)?
                                        ''
                                        :e.name.charAt(0).toUpperCase()
                                    }
                            </div>
                            <span className="chat-profile-name">{e.name.toUpperCase()}</span>
                            <span className="chat-profile-time">{
                            `${date.getHours()} : ${date.getMinutes()}`
                            } Uhr</span>
                            </div>
                            {
                                (typeof(e.massage) == 'string')?
                                    <p className="text-message-chat">
                                        {
                                            (e.massage.substring(0,4) === 'http' )?
                                            < >
                                             <a className='chatLink' href={e.massage} target="_blank" >{e.massage}</a>
                                             <br></br>
                                           
                                             </>
                                            :
                                            e.massage
                                        }
                                    </p>
                                :
                                    <div className="file-lists">
                                    <div className="file-info" title={e.massage.name} >
                                    {
                                        (e.massage.name.length > 15 )?
                                        e.massage.name.substring(0,20)+'...'
                                        :
                                        e.massage.name
                                    } 
                                    <i class="fa-solid fa-cloud-arrow-down"
                                    onClick={()=>{
                                        Download(e.massage.buffer, e.massage.name);
                                    }} 
                                    ></i>
                                    </div>
                                    {
                                        (e.massage.type  == 'text/html' || e.massage.type  == 'application/pdf' || e.massage.type  == 'text/csv' || e.massage.type  =='video/mp4' || e.massage.type.substring(0,5) == 'image' )?
                                         <embed className="main-file-lists" type={e.massage.type} src={e.massage.buffer}/>
                                        :
                                        <div className="File_preview" > 
                                        <i class="fa-solid fa-file"></i>
                                        {e.massage.type}-File </div>
                                    }
                                    
                                    </div>
                            }
                        </li>
                    })
                }
            </ul>
       
            <div  className="chatForm" >
                <div className="up_imo_Box">
                    <i class="fa-regular fa-face-grin"
                    onClick={()=>{
                        (emoji) ? setEmoji(false) : setEmoji(true);
                    }}
                    ></i>
                    <i class="fa-solid fa-paperclip"
                    onClick={(e)=>{
                        e.target.children[0].click();
                    }}>
                        
                        <input type="file"
                            onChange={(e)=>{
                                dragAndDropUpload(e);
                                setTextType(e.target.value)

                            }}
                            onDrop={(e)=>{
                                dragAndDropUpload(e);
                            }}/> 
                    </i>
                </div>
             
                
                {
                    (onDragOver)?
                    <textarea className="textarea" placeholder="Massage..." value={textType}
                    onKeyPress={(e)=>{
                        if(e.code === 'Enter')
                        {
                            e.preventDefault();
                            if(textType != '')
                            {
                                const user = JSON.parse(localStorage.getItem('user'));
                                if(sendFile != '' )
                                {
                                    const data = {
                                        name:user.username,
                                        img:user.img,
                                        massage:sendFile
                                    }
                                    socket.emit('massage',data)
                                    console.log(sendFile);
                                    setSendFile('');
                                    setTextType('');
                                }else{
                                    const data = {
                                        name:user.username,
                                        img:user.img,
                                        massage:textType
                                    }
                                    socket.emit('massage',data)
                                    setTextType('');
                                    e.target.parentElement.parentElement.children[1].scrollTo(0,e.target.parentElement.parentElement.children[1].scrollHeight);
                                    setEmoji(false); 
                                }
                               
                            }else{
                                setSendFile('');
                            }
                        }
                    
                    }}
                    onChange={(e)=>{
                        setTextType(e.target.value)
                    }}
                    onDragOver={(e)=>{
                        setOnDragOver(false);
                    }}
                ></textarea>
                :
                <div className="onDragOver">
                    <input className="onDragOver-click" type="file"
                    onChange={(e)=>{
                        dragAndDropUpload(e);
                        setOnDragOver(true);
                        setTextType(e.target.value);
                    }}
                    onDrag={(e)=>{
                        setOnDragOver(true);
                    }}
                    onDrop={(e)=>{
                        dragAndDropUpload(e.target);
                        console.log(e);
                        setOnDragOver(true);
                        setTextType(e.target.value)
                        
                    }}
                    onDragLeave={(e)=>{
                        setOnDragOver(true);
                    }}
                    /> 
                      <p className="dragText" >Drag Your File Here...</p>
                </div>
                }
                <i class="fa-solid fa-paper-plane"
                onClick={(e)=>{
                    
                    if(textType != '')
                    {
                        const user = JSON.parse(localStorage.getItem('user'));
                        if(sendFile != '' )
                        {
                            const data = {
                                name:user.username,
                                img:user.img,
                                massage:sendFile
                            }
                            socket.emit('massage',data)
                            console.log(sendFile);
                            setSendFile('');
                            setTextType('');
                        }else{
                            const data = {
                                name:user.username,
                                img:user.img,
                                massage:textType
                            }
                            socket.emit('massage',data)
                            setTextType('');
                            e.target.parentElement.parentElement.children[1].scrollTo(0,e.target.parentElement.parentElement.children[1].scrollHeight);
                            setEmoji(false); 
                        }
                       
                    }else{
                        setSendFile('');
                    }
                
                    
                }}
                ></i>
            </div>
        </motion.div>
    )
 }
 export { Chatt }








