import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import axios from "axios";

function AdminModal() {
  const productModalRef = useRef(null);
  const productModalInstance = useRef(null);

  useEffect(() => {
    productModalInstance.current = new Modal(productModalRef.current, {
      backdrop: false,
    });
  }, []);

  return (
    <div
      id="productModal"
      className="modal"
      ref={productModalRef}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered"></div>
    </div>
  );
}
