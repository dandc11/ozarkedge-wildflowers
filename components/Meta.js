import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import Link from "next/link";

const Meta = (props) => {
  return (
    <Head>
      <title>Sanity site settings should set this value!</title>
      <meta name="description" content="" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

Meta.propTypes = {};

export default Meta;
