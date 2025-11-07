"use client";
import React, { useState } from "react";
import { useCalculatorStore } from "@/store/useCalculatorStore";
import { InputField, SectionCard } from "../elements";

const numberFormatter = new Intl.NumberFormat("vi-VN");

export function TotalSection() {
  const { calcTotal } = useCalculatorStore();
  const total = calcTotal();
  const [visible, setVisible] = useState(false);

  const BANK = "BIDV";
  const ACCOUNT = "1600592248";
  const addInfo = "Tien+Phong+Thang+11";
  const qrSrc = `https://img.vietqr.io/image/${BANK}-${ACCOUNT}-compact2.png?amount=${total}&addInfo=${addInfo}&accountName=TRAN%20THI%20HUONG`;

  const formattedTotal = numberFormatter.format(total);

  return (
    <SectionCard title="Tổng thanh toán">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="text-3xl font-extrabold text-red-600 tracking-wide">
          {formattedTotal} ₫
        </div>

        <button
          onClick={() => setVisible((s) => !s)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
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
                {formattedTotal} ₫
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
