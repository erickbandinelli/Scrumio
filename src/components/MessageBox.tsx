import React from 'react'

interface MessageBoxProps {
  message: string
  type?: 'info' | 'success' | 'error'
  onClose: () => void
}

const MessageBox: React.FC<MessageBoxProps> = ({
  message,
  type = 'info',
  onClose
}) => {
  let bgColorClass = 'bg-blue-100 border-blue-400 text-blue-700'
  let textColorClass = 'text-blue-700'

  if (type === 'success') {
    bgColorClass = 'bg-green-100 border-green-400 text-green-700'
    textColorClass = 'text-green-700'
  } else if (type === 'error') {
    bgColorClass = 'bg-red-100 border-red-400 text-red-700'
    textColorClass = 'text-red-700'
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`relative ${bgColorClass} border px-4 py-3 rounded-lg shadow-lg max-w-sm w-full`}
      >
        <p className={`font-semibold ${textColorClass}`}>{message}</p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close message"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MessageBox
