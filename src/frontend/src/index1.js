import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Home }  from '../pages/Home/Home1';

ReactDOM.render(<BrowserRouter>
    <Home/>
  </BrowserRouter>, document.getElementById('root'));