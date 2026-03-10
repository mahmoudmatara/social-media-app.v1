import React from "react";
import { CgDanger } from "react-icons/cg";

export default function DetectOnlin() {
  return (
    <div className="fixed inset-0 bg-gray-800/90 flex justify-center z-101 items-center">
      <h1 className="font-bold text-white text-2xl flex items-center gap-3">
        <CgDanger />
        YOU ARE OFFLINE NOW... !
      </h1>
    </div>
  );
}
