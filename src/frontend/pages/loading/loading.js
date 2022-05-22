import React from 'react';
import logo from '../../images/Logo.png';
import { motion } from "framer-motion";
import { useState } from 'react';
import "./loading.css";    


const Loading = () => { 
    const [ dis,setDis ] = useState('block');

    setTimeout(()=>{
        setDis('none')
    },3000);

    return (
    <motion.div 
    
    style={{display:dis}}
    initial={{opacity:1}}
    animate={{opacity:0}}
    transition={{ delay:2 , duration:0.5 }}
    className="loading_container">

        <motion.div className="box"
            initial={{opacity:1}}
            animate={{opacity:0}}
            transition={{ delay:3 , duration:0.5 }}
        >
           

        
        <motion.img 
         initial={{opacity:0}}
         animate={{opacity:1}}
         transition={{ duration:1 }}
        src={logo}
        />
     

        <motion.p 
        initial={{opacity:0}}
        animate={{opacity:1}}
        transition={{ duration:1 }}
                
        className="loading_copy_right">© 2022 direct, Inc</motion.p>
        </motion.div>
  
    </motion.div>
 )}

 export { Loading }