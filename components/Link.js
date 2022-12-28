import React from "react";
import Link from "next/link";


export default ({ href, children }) => {
  return (
    <>
      {href?.internal ? (
        <Link href={href.internal.slug.current}>{children}</Link>
      ) : href?.external ? (
        <a href={href.external} target="_blank" rel="noopener noreferrer">{children}</a>
      ) : null}
    </>
  );
};