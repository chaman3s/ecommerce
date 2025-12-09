export default function CarouselSkeleton() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <div className="absolute inset-0 animate-pulse bg-gray-200/60"></div>

      {/* Gradient shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300/40 to-transparent animate-[shimmer_1.6s_infinite]"></div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
