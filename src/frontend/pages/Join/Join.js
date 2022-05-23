import React, { useState } from "react";
import  { motion } from 'framer-motion';

import "./Join.css";


 const Join = (props) => {
  const [userName, setUserName] = useState("");
  const [ dis , setDis] = useState (true);
 
  const handleChange = (e) => {
    e.preventDefault();
    setUserName(e.target.value);
  };

  const handleClick = (e) => {
    if(userName != '')
    {
      localStorage.setItem('user', JSON.stringify({username:userName}));
      setUserName("");
      props.setDis(false);
      setTimeout (()=>{
        setDis(false)
      },1000);
    }
  };

  return (
    <motion.div className="JoinPage" 
    animate={{opacity:(props.dis)? 1:0}}  
    style={{display:(dis)? 'block':'none'}}
    >
      <div className="logoImg" ></div>
      <div className="f" >
        <input type="text" placeholder="username" value={userName} onChange={handleChange} />
        <button onClick={handleClick}>+ Join</button>
      </div>
    
    </motion.div>
  );
};
export { Join }
