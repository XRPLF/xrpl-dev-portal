export const PlusIcon: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = "", style }) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`bds-icon ${className}`.trim()}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C12.6904 2 13.25 2.55964 13.25 3.25V20.75C13.25 21.4404 12.6904 22 12 22C11.3096 22 10.75 21.4404 10.75 20.75V3.25C10.75 2.55964 11.3096 2 12 2Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 12C2 11.3096 2.55964 10.75 3.25 10.75H20.75C21.4404 10.75 22 11.3096 22 12C22 12.6904 21.4404 13.25 20.75 13.25H3.25C2.55964 13.25 2 12.6904 2 12Z"
        fill="currentColor"
      />
    </svg>
  );
};
