'use client';

import React, { useState } from 'react';

export const NavContext = React.createContext();

export const NavContextProvider = (props) => {
    const [navButtonColor, setNavButtonColor] = useState('dark');

    const contextValue = {
        navButtonColor,
        setNavButtonColor,
    };

    return (
      <NavContext.Provider value={contextValue}>
        {props.children}
      </NavContext.Provider>
    );
};