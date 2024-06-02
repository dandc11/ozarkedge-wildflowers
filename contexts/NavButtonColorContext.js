// MenuButtonColorContext.js
import React, { useState } from 'react';

export const NavButtonColorContext = React.createContext();

export const NavButtonColorProvider = (props) => {
    const [navButtonColor, setNavButtonColor] = useState('dark');
  
    return (
      <NavButtonColorContext.Provider value={[navButtonColor, setNavButtonColor]}>
        {props.children}
      </NavButtonColorContext.Provider>
    );
  };