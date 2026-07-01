// components/ThresholdSection.tsx
'use client'

interface ThresholdSectionProps {
  threshold: number
  setThreshold: (value: number) => void
}

export default function ThresholdSection({
  threshold,
  setThreshold,
}: ThresholdSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Attendance Threshold</h3>
          <p className="text-sm text-gray-600">Set minimum attendance percentage</p>
        </div>
      </div>

      {/* Threshold Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Minimum Attendance %
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => {
            const value = parseInt(e.target.value)
            if (value >= 0 && value <= 100) {
              setThreshold(value)
            }
          }}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition text-lg text-center font-semibold"
        />
      </div>

      {/* Visual Slider */}
      <div className="mb-6">
        <input
          type="range"
          min="0"
          max="100"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
          className="w-full h-2 bg-gradient-to-r from-red-500 to-green-500 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f59e0b ${threshold}%, #10b981 ${threshold}%, #10b981 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-600 mt-2">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Current Value Display */}
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4">
        <p className="text-sm text-gray-700 mb-1">
          <span className="font-semibold">Current Threshold:</span>
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-orange-600">{threshold}</span>
          <span className="text-gray-600">%</span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Students with attendance below {threshold}% will be notified
        </p>
      </div>
    </div>
  )
}
