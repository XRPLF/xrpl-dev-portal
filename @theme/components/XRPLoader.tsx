// Loading animation component used in various custom pages.

export interface XRPLoaderProps {
    message?: string
    show?: boolean
}

export default function XRPLoader(props: XRPLoaderProps) {
  const classnames = props.show ? "loader" : "loader collapse"
  return (
    <div className={classnames}>
      <img alt="(loading)" className="throbber" src="/img/xrp-loader-96.png" />
      {props.message}
    </div>
  )
}
