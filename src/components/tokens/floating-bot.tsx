"use client";

export function FloatingBot() {
  return (
    <button
      type="button"
      type="button"
      className="fixed bottom-6 right-6 w-[56px] h-[56px] bg-[#00D897] hover:bg-[#00c589] rounded-full shadow-[0_4px_20px_rgba(0,216,151,0.4)] hover:shadow-[0_4px_25px_rgba(0,216,151,0.6)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 z-50 group"
    >
      {/* Robot Face SVG Icon */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7 text-black group-hover:rotate-6 transition-transform duration-300"
      >
        <title>AI Trading Bot</title>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path d="M12 2v4" />
        <path d="M12 6H8a2 2 0 0 1-2-2" />
        <path d="M12 6h4a2 2 0 0 0 2-2" />
        <circle cx="8" cy="16" r="1" />
        <circle cx="16" cy="16" r="1" />
      </svg>
    </button>
  );
}
