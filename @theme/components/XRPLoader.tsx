import * as React from 'react';

export interface XRPLoaderProps {
    message?: string
}

export default function XRPLoader(props: XRPLoaderProps) {
  return (
  <div className="loader">
    <img alt="(loading)" className="throbber" src="/img/xrp-loader-96.png" />
    {props.message}
  </div>);
}
