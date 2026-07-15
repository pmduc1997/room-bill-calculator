"use client";

import { useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCalculatorStore } from "@/store/useCalculatorStore";

const currency = new Intl.NumberFormat("vi-VN");

export default function InvoicePage() {
  const router = useRouter();
  const {
    currentRoom,
    bankInfo,
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

  const accountNameEncoded = encodeURIComponent(bankInfo.accountName);
  const addInfo = `${currentRoom?.id ?? "Unknown"}`;
  const qrSrc = `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact2.png?amount=${grandTotal}&addInfo=${addInfo}&accountName=${accountNameEncoded}`;

  if (!currentRoom.id) return <div>Lỗi mã phòng, cần sửa!</div>;

  return (
    <main className="min-h-screen bg-brand-bg text-brand-ink">
      <div className="mx-auto w-full max-w-md md:max-w-2xl pb-8">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-brand-border">
          <button
            onClick={() => router.push("/")}
            className="text-sm font-medium text-brand-primary hover:text-brand-primary-hover transition-colors"
          >
            ← Trở về
          </button>
          <p className="text-xs text-brand-muted">Xuất: {issuedAt}</p>
        </header>

        {/* Invoice body */}
        <section className="bg-white mx-4 mt-4 rounded-2xl shadow-sm border border-brand-border overflow-hidden">
          {/* Invoice title bar */}
          <div className="bg-brand-primary px-6 py-5 text-white">
            <p className="text-xs font-medium opacity-70 uppercase tracking-wide">
              Hóa đơn
            </p>
            <h1 className="text-lg font-bold mt-1">
              Phòng {currentRoom?.id} · Tháng {month}/{year}
            </h1>
          </div>

          <div className="px-5 py-5 md:px-8 md:py-6 space-y-4">
            {/* Room rent */}
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted font-medium">Tiền phòng</span>
              <span className="font-semibold text-brand-accent tabular-nums">
                {currency.format(rentTotal)} ₫
              </span>
            </div>

            {/* Electricity */}
            <Section title="Điện" amount={elecTotal}>
              <Row label="Chỉ số đầu" value={currentRoom?.elec.start} suffix="kWh" />
              <Row label="Chỉ số cuối" value={currentRoom?.elec.end} suffix="kWh" />
              <Row label="Tiêu thụ" value={currentRoom?.elec.used} suffix="kWh" />
              <Row label="Đơn giá" value={currency.format(currentRoom?.elec.price)} suffix="₫/kWh" />
            </Section>

            {/* Water */}
            <Section title="Nước" amount={waterTotal}>
              <Row label="Chỉ số đầu" value={currentRoom?.water.start} suffix="m³" />
              <Row label="Chỉ số cuối" value={currentRoom?.water.end} suffix="m³" />
              <Row label="Tiêu thụ" value={currentRoom?.water.used} suffix="m³" />
              <Row label="Đơn giá" value={currency.format(currentRoom?.water.price)} suffix="₫/m³" />
            </Section>

            {/* Services */}
            <Section title="Dịch vụ" amount={serviceTotal}>
              <Row label="Internet" value={currency.format(currentRoom?.services.internet)} suffix="₫" />
              <Row label="Vệ sinh + thang máy" value={currency.format(currentRoom?.services.cleaning)} suffix="₫/người" />
              <Row label="Máy giặt" value={currency.format(currentRoom?.services.washing)} suffix="₫/người" />
              <Row label="Số người" value={currentRoom?.services.person} />
            </Section>

            {/* Grand total */}
            <div className="border-t border-brand-border pt-4 flex items-center justify-between">
              <span className="text-base font-semibold text-brand-ink">Tổng thanh toán</span>
              <span className="text-xl font-bold text-brand-accent tabular-nums">
                {currency.format(grandTotal)} ₫
              </span>
            </div>

            {/* QR + bank info */}
            <div className="flex items-start gap-5 pt-2">
              <img
                src={qrSrc}
                alt="QR chuyển khoản"
                className="w-32 md:w-40 rounded-xl border border-brand-border shrink-0"
              />
              <div className="flex-1 space-y-1.5 text-xs text-brand-muted">
                <p className="text-sm font-semibold text-brand-ink mb-2">
                  Thông tin chuyển khoản
                </p>
                <InfoRow label="Ngân hàng" value={bankInfo.bankName} />
                <InfoRow label="Số tài khoản" value={bankInfo.accountNumber} />
                <InfoRow label="Nội dung" value={addInfo.replace(/\+/g, " ")} />
                <InfoRow label="Người nhận" value={bankInfo.accountName} />
              </div>
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
    <div className="border-t border-brand-border pt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-brand-ink">{title}</span>
        <span className="text-sm font-semibold text-brand-accent tabular-nums">
          {currency.format(amount)} ₫
        </span>
      </div>
      <div className="space-y-1 text-xs text-brand-muted">{children}</div>
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
      <span className="font-medium text-brand-ink tabular-nums">
        {value ?? 0}
        {suffix ? ` ${suffix}` : ""}
      </span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="font-medium text-brand-ink text-right">{value}</span>
    </div>
  );
}
