'use client';

import { NavContextProvider } from '../contexts/NavContext';
import { LightboxProvider } from '../contexts/LightboxContext';
import Layout from '../components/Layout';

export default function ClientProviders({ children }) {
  return (
    <>
        <NavContextProvider>
          <LightboxProvider>
            <Layout>{children}</Layout>
          </LightboxProvider>
        </NavContextProvider>
    </>
  );
}