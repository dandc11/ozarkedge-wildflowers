import { groq } from "next-sanity";
import { useRouter } from "next/router";
import client, { getClient, usePreviewSubscription } from "@lib/sanity";

export default function Home() {
  return (
    <div className="test-styles">
      <h1>Testing Testing 123</h1>
    </div>
  );

  const query = groq`
    *[_type == "landingPage"] {
      id,
      mainImage,
      subtitleText,
      titleText
    }`;

  // export async function getStaticProps(context) {
  //   return {
  //     props: {},
  //   };
  // }
}
