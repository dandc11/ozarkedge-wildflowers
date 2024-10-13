import Head from 'next/head';
import dynamic from 'next/dynamic';
import {metadata, viewport} from 'next-sanity/studio'

// TODO: Themeing and more studio control...what needs to be done?
// TODO: Should Head be used here? 
const Studio = dynamic(() => import('./studio'), { ssr: false });

export default function StudioPage() {
  return (
    <>
      <Head>
        {metadata &&
          Object.entries(metadata).map(([key, value]) => (
            <meta key={key} name={key} content={value} />
          ))
        }
      </Head>
      <Studio />
    </>
  );
}