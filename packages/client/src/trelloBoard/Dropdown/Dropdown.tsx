import React, { useEffect, useRef } from "react";

function Dropdown(props: any) {
  const dropdownRef: any = useRef();

  const handleClick = (event: any) => {
    if (
      dropdownRef &&
      !dropdownRef.current?.contains(event.target) &&
      props.onClose
    )
      props.onClose();
  };

  useEffect(() => {
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className={`dropdowns custom-scroll ${props.class ? props.class : ""}`}
    >
      {props.children}
    </div>
  );
}

export default Dropdown;
