"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCalculatorStore } from "@/store/useCalculatorStore";
import { BANK_INFO } from "@/constant";

const currency = new Intl.NumberFormat("vi-VN");

export default function InvoicePage() {
  const router = useRouter();
  const {
    currentRoom,
    calcTotal,
    calcElecTotal,
    calcWaterTotal,
    calcServiceTotal,
  } = useCalculatorStore();

  const issuedAt = useMemo(() => new Date().toLocaleString("vi-VN"), []);

  const rentTotal = currentRoom?.price ?? 0;
  const elecTotal = calcElecTotal();
  const waterTotal = calcWaterTotal();
  const serviceTotal = calcServiceTotal();
  const grandTotal = calcTotal();
  const month = new Date().toLocaleString("en-US", { month: "2-digit" });
  const year = new Date().getFullYear();

  const accountNameEncoded = encodeURIComponent(BANK_INFO.accountName);

  const addInfo = `${currentRoom?.id ?? "Unknown"}`;
  const qrSrc = `https://img.vietqr.io/image/${BANK_INFO.bankName}-${BANK_INFO.accountNumber}-compact2.png?amount=${grandTotal}&addInfo=${addInfo}&accountName=${accountNameEncoded}`;

  if (!currentRoom.id) return <div>Lỗi mã phòng, cần sửa!</div>;

  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-white text-gray-900">
      <div className="mx-auto w-full max-w-md md:max-w-2xl pb-6 md:pb-8">
        <header className="flex items-center justify-between px-4 md:px-6 py-2 md:py-3">
          <button
            onClick={() => router.push("/")}
            className="text-sm md:text-base font-medium text-blue-600 hover:text-blue-700"
          >
            ← Trở về
          </button>
          <div className="text-right text-xs md:text-sm text-gray-500">
            <p>Xuất: {issuedAt}</p>
          </div>
        </header>

        <section className="bg-white p-5 md:p-8 shadow-lg space-y-4 md:space-y-6">
          <div className="flex justify-center font-bold text-base md:text-xl">
            HÓA ĐƠN P{currentRoom?.id} THÁNG {month}/{year}
          </div>
          <div className="grid grid-cols-2 text-sm md:text-base">
            <div className="font-semibold">Tiền phòng</div>
            <div className="text-right font-semibold text-blue-600">
              {currency.format(rentTotal)} ₫
            </div>
          </div>

          <div className="space-y-2 md:space-y-3 text-sm md:text-base">
            <Section title="Điện" amount={elecTotal}>
              <Row
                label="Chỉ số đầu"
                value={currentRoom?.elec.start}
                suffix="kWh"
              />
              <Row
                label="Chỉ số cuối"
                value={currentRoom?.elec.end}
                suffix="kWh"
              />
              <Row
                label="Tiêu thụ"
                value={currentRoom?.elec.used}
                suffix="kWh"
              />
              <Row
                label="Đơn giá"
                value={currency.format(currentRoom?.elec.price)}
                suffix="₫"
              />
            </Section>

            <Section title="Nước" amount={waterTotal}>
              <Row
                label="Chỉ số đầu"
                value={currentRoom?.water.start}
                suffix="m³"
              />
              <Row
                label="Chỉ số cuối"
                value={currentRoom?.water.end}
                suffix="m³"
              />
              <Row
                label="Tiêu thụ"
                value={currentRoom?.water.used}
                suffix="m³"
              />
              <Row
                label="Đơn giá"
                value={currency.format(currentRoom?.water.price)}
                suffix="₫"
              />
            </Section>

            <Section title="Dịch vụ" amount={serviceTotal}>
              <Row
                label="Mạng"
                value={currency.format(currentRoom?.services.internet)}
                suffix="₫"
              />
              <Row
                label="Vệ sinh + Thang máy / người"
                value={currency.format(currentRoom?.services.cleaning)}
                suffix="₫ / người"
              />
              <Row
                label="Máy giặt"
                value={currency.format(currentRoom?.services.washing)}
                suffix="₫ / người"
              />
              <Row label="Số người" value={currentRoom?.services.person} />
            </Section>
            <div className="border-t border-gray-300 pt-2 md:pt-3">
              <div className="flex items-center justify-between text-sm md:text-base font-semibold text-gray-700">
                <span className="text-lg md:text-xl">Tổng</span>
                <span className="text-blue-600 text-lg md:text-xl">
                  {currency.format(calcTotal())} ₫
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 md:gap-6 rounded-xl">
            <img
              src={qrSrc}
              alt="QR chuyển khoản"
              className="w-36 md:w-48 rounded-lg border border-gray-100"
            />
            <div className="flex-1 space-y-1 md:space-y-2 text-xs md:text-sm text-gray-700">
              <p className="font-semibold text-sm md:text-base text-gray-900">
                THÔNG TIN
              </p>
              <InfoRow label="Ngân hàng" value={BANK_INFO.bankName} />
              <InfoRow label="STK" value={BANK_INFO.accountNumber} />
              <InfoRow label="Nội dung" value={addInfo.replace(/\+/g, " ")} />
              <InfoRow label="Người nhận" value={BANK_INFO.accountName} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Section({
  title,
  amount,
  children,
}: {
  title: string;
  amount: number;
  children: ReactNode;
}) {
  return (
    <div className="border-t border-gray-300 pt-2 md:pt-3">
      <div className="flex items-center justify-between text-sm md:text-base font-semibold text-gray-700 mb-1">
        <span>{title}</span>
        <span className="text-blue-600">{currency.format(amount)} ₫</span>
      </div>
      <div className="space-y-1 md:space-y-2 text-xs md:text-sm text-gray-600">
        {children}
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number | undefined;
  suffix?: string;
}) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="font-medium">
        {value ?? 0}
        {suffix ? ` ${suffix}` : ""}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 md:gap-4">
      <span className="text-gray-500">{label}</span>
      <span className="text-right font-medium text-gray-900">{value}</span>
    </div>
  );
}
