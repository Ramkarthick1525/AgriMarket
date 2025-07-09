import React, { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";

const QRCodePage = () => {
  const websiteUrl = "https://agrimart-yourdomain.com"; // Replace with your deployed domain
  const qrRef = useRef();

  const downloadQRCode = () => {
    if (!qrRef.current) return;
    toPng(qrRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "AgriMart-QR-Code.png";
        link.href = dataUrl;
        link.click();
      })
      .catch(() => {
        toast.error("Failed to download QR code.");
      });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 animate-background px-6 py-10">
      <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 drop-shadow mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400">
          AgriMart
        </span>
      </h1>

      <p className="text-lg text-gray-700 mb-6">Scan to explore our products!</p>

      <div
        ref={qrRef}
        className="p-6 bg-white border-4 rounded-xl shadow-2xl relative glow-border"
      >
        <QRCodeCanvas
          value={websiteUrl}
          size={250}
          bgColor="#ffffff"
          fgColor="#166534"
          level="H"
          includeMargin={true}
        />

        {/* Scan Me Badge */}
        <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-green-700 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
          📱 Scan Me
        </div>
      </div>

      <button
        onClick={downloadQRCode}
        className="mt-10 px-8 py-3 bg-gradient-to-r from-green-700 to-emerald-500 text-white rounded-full font-bold shadow-lg hover:scale-105 hover:shadow-xl transition-transform duration-300"
      >
        📥 Download QR Code
      </button>

      {/* 👇 Extra Glow */}
      <style>{`
        .glow-border {
          border-color: #22c55e;
          box-shadow: 0 0 20px #4ade80, 0 0 40px #86efac;
          animation: pulse-glow 2s infinite;
        }

        @keyframes pulse-glow {
          0% { box-shadow: 0 0 10px #4ade80; }
          50% { box-shadow: 0 0 25px #4ade80, 0 0 40px #86efac; }
          100% { box-shadow: 0 0 10px #4ade80; }
        }

        @keyframes background {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-background {
          background-size: 200% 200%;
          animation: background 15s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default QRCodePage;
