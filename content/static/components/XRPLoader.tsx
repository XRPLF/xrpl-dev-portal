import * as React from 'react';

export interface XRPLoaderProps {
    message?: string
}

export default function XRPLoader(props: XRPLoaderProps) {
  return (
  <div id="loader" style={{ display: "inline" }}>
    <img alt="(loading)" className="throbber" src="/img/xrp-loader-96.png" />
    {props.message}
  </div>);
}
