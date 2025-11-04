"use client";
import React, { useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import SectionCard from "../elements/SectionCard";

export default function TotalSection() {
  const { calcTotal } = useCalculatorStore();
  const total = calcTotal();
  const [visible, setVisible] = useState(false);

  const BANK = "VCB";
  const ACCOUNT = "0011004455108";
  const addInfo = "Tien+Phong+Thang+11";
  const qrSrc = `https://img.vietqr.io/image/${BANK}-${ACCOUNT}-compact2.png?amount=${total}&addInfo=${addInfo}`;

  return (
    <SectionCard title="Tổng thanh toán">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="text-3xl font-extrabold text-red-600 tracking-wide">
          {total.toLocaleString()} ₫
        </div>

        <button
          onClick={() => setVisible((s) => !s)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
        >
          {visible ? "Ẩn mã QR" : "Hiện mã QR chuyển khoản"}
        </button>

        {visible && (
          <div className="flex flex-col items-center">
            <img
              src={qrSrc}
              alt="QR chuyển khoản"
              className="w-52 h-52 rounded-md"
            />
            <p className="mt-3 text-gray-700 text-sm">
              Quét mã bằng app ngân hàng để chuyển{" "}
              <span className="font-semibold text-blue-600">
                {total.toLocaleString()} ₫
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              STK: <b>{ACCOUNT}</b> ({BANK})
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
