import React from "react";
// import "./Modal.css";
function Modal(props: any) {
  return (
    <>
      <div
        className="modal2"
        onClick={() => (props.onClose ? props.onClose() : "")}
      >
        <div
          className="modal2-content custom-scroll py-4"
          onClick={(event) => event.stopPropagation()}
        >
          {props.children}
        </div>
      </div>
    </>
  );
}
export default Modal;
