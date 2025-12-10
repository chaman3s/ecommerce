export default function Step({ step, label, active, done, right, onClick }) {
    return (
      <div
        className={`flex justify-between px-4 py-3 border-b cursor-pointer
                    ${active ? "bg-blue-50 border-blue-500" : "bg-white"}`}
        onClick={onClick}
      >
        <div className="flex items-center gap-2">
          <div
            className={`h-6 w-6 rounded-full text-xs flex items-center justify-center font-bold
            ${
              done
                ? "bg-green-600 text-white"
                : active
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-700"
            }`}
          >
            {step}
          </div>
          <span
            className={`text-sm ${
              active || done ? "font-semibold" : "text-gray-600"
            }`}
          >
            {label}
          </span>
        </div>

        {right && <span className="text-xs text-gray-500">{right}</span>}
      </div>
    );
  }