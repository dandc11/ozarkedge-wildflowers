'use client';

import { NavContextProvider } from '../contexts/NavContext';
import { LightboxProvider } from '../contexts/LightboxContext';

export default function ClientProviders({ children }) {
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