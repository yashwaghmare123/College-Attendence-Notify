// components/UploadSection.tsx
'use client'

interface UploadSectionProps {
  file: File | null
  setFile: (file: File | null) => void
  onUpload: () => void
  loading: boolean
}

export default function UploadSection({
  file,
  setFile,
  onUpload,
  loading,
}: UploadSectionProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel']
      
      if (!validTypes.includes(selectedFile.type)) {
        alert('Please select a CSV or XLSX file')
        return
      }

      setFile(selectedFile)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Upload Attendance</h3>
          <p className="text-sm text-gray-600">File input (accept only .csv and .xlsx)</p>
        </div>
      </div>

      {/* Format Badge */}
      <div className="mb-6 inline-block">
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
          FORMAT: XLSX
        </span>
      </div>

      {/* File Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Select File
        </label>
        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center hover:border-blue-500 transition cursor-pointer group">
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
            id="file-input"
            disabled={loading}
          />
          <label htmlFor="file-input" className="cursor-pointer">
            {file ? (
              <div>
                <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 16.5a1 1 0 01-1-1V9h-.5a1 1 0 010-2H7V5.5a1 1 0 112 0v1.5h.5a1 1 0 010 2H9v6.5a1 1 0 01-1 1z" clipRule="evenodd" />
                </svg>
                <p className="text-green-600 font-semibold">{file.name}</p>
                <p className="text-green-500 text-sm mt-1">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            ) : (
              <div>
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3 group-hover:text-blue-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 font-semibold">Drag and drop file here or browse</p>
                <p className="text-gray-500 text-sm mt-1">Supported formats: CSV, XLSX</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Upload Button */}
      <button
        onClick={onUpload}
        disabled={!file || loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          file && !loading
            ? 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Upload File
          </>
        )}
      </button>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-gray-700">
          <span className="font-semibold">Required Columns:</span> Registration Number, Student Name, Attendance %
        </p>
      </div>
    </div>
  )
}
