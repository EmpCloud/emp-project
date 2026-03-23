import React from "react";
// import "./Modal.css";
function Modal2(props: any) {
  return (
    <>
      <div
        className="modal"
        onClick={() => (props.onClose ? props.onClose() : "")}
      >
        <div
          className="modal2-content custom2-scroll"
          onClick={(event) => event.stopPropagation()}
        >
          {props.children}
        </div>
      </div>
    </>
  );
}
export default Modal2;
