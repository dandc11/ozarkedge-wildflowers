'use client';

import { NavContextProvider } from '../contexts/NavContext';
import { LightboxProvider } from '../contexts/LightboxContext';

export default function ContextProviders({ children }) {
  return (
    <>
        <NavContextProvider>
          <LightboxProvider>
            {children}
          </LightboxProvider>
        </NavContextProvider>
    </>
  );
}