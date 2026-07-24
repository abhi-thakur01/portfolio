import React from "react";
import { CheckCircle2, Info, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "info";
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl bg-[#141424] border border-[#c9a227]/40 shadow-2xl shadow-black/80 text-white animate-bounce-short">
      {type === "success" ? (
        <CheckCircle2 className="w-5 h-5 text-[#f0d060] shrink-0" />
      ) : (
        <Info className="w-5 h-5 text-[#c9a227] shrink-0" />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-white transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
