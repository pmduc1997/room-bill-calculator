"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useCalculatorStore } from "@/store/useCalculatorStore";

const currency = new Intl.NumberFormat("vi-VN");

export default function InvoicePage() {
  const router = useRouter();
  const billRef = useRef<HTMLElement>(null);
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
  const accountNameEncoded = encodeURIComponent(bankInfo.accountName);
  const addInfo = `${currentRoom?.id ?? "Unknown"}`;
  const qrSrc = `https://img.vietqr.io/image/${bankInfo.bankName}-${bankInfo.accountNumber}-compact2.png?amount=${grandTotal}&addInfo=${addInfo}&accountName=${accountNameEncoded}`;

  async function handleDownload() {
    if (!billRef.current) return;

    const { toPng } = await import("html-to-image");

    const now = new Date();
    const stamp = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const filename = `hoadon-phong${currentRoom?.id ?? ""}-${stamp}.png`;

    const { offsetWidth, offsetHeight } = billRef.current;

    const dataUrl = await toPng(billRef.current, {
      pixelRatio: 3,
      cacheBust: true,
      fetchRequestInit: { mode: "cors" },
      width: offsetWidth,
      height: offsetHeight,
      style: {
        margin: "0",
        borderRadius: "0",
      },
    });

    // Try Web Share API (works on iOS Safari 15+)
    if (typeof navigator.share === "function") {
      try {
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const file = new File([blob], filename, { type: "image/png" });
        await navigator.share({ files: [file], title: filename });
        return;
      } catch {
        // User cancelled or share failed — fall through
      }
    }

    // Desktop: anchor download
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  }

  function handleShare() {
    // TODO: implement share
  }

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
        </header>

        {/* Invoice body */}
        <section
          ref={billRef}
          className="bg-white mx-4 mt-1 rounded-xl shadow-sm border border-brand-border overflow-hidden"
        >
          {/* Invoice title bar */}
          <div className="bg-brand-primary px-4 py-3 text-white">
            <h1 className="text-lg font-bold">
              Hóa đơn phòng {currentRoom?.id}
            </h1>
            <p className="text-xs opacity-70 mt-0.5">Xuất ngày: {issuedAt}</p>
          </div>

          <div className="px-5 py-4 md:px-8 md:py-6 space-y-2">
            {/* Room rent */}
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted font-medium">Tiền phòng</span>
              <span className="font-semibold text-brand-accent tabular-nums whitespace-nowrap">
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
            <div className="border-t border-brand-border pt-2 flex items-center justify-between">
              <span className="text-base font-semibold text-brand-ink">Tổng thanh toán</span>
              <span className="text-xl font-bold text-brand-accent tabular-nums whitespace-nowrap">
                {currency.format(grandTotal)} ₫
              </span>
            </div>

            {/* QR + bank info */}
            <div className="flex items-start gap-3 pt-2">
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
                <InfoRow label="STK" value={bankInfo.accountNumber} />
                <InfoRow label="Nội dung" value={addInfo.replace(/\+/g, " ")} />
                <InfoRow label="Người nhận" value={bankInfo.accountName} />
              </div>
            </div>

          </div>
        </section>
        {/* Action bar */}
        <div className="px-4 pt-4 flex gap-3">
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-border text-brand-ink text-sm font-medium transition-colors hover:bg-brand-bg active:scale-95"
          >
            <ShareIcon />
            Chia sẻ
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-brand-primary text-white text-sm font-semibold transition-colors hover:bg-brand-primary-hover active:scale-95"
          >
            <DownloadIcon />
            Lưu ảnh
          </button>
        </div>
      </div>
    </main>
  );
}

function DownloadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
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
    <div className="border-t border-brand-border pt-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-semibold text-brand-ink">{title}</span>
        <span className="text-sm font-semibold text-brand-accent tabular-nums whitespace-nowrap">
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
      <span className="font-medium text-brand-ink tabular-nums whitespace-nowrap">
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
