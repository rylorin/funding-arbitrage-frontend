import { cn } from "@/lib/utils/cn"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner = ({ size = 'md', className }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-600 border-t-[#00d9ff]',
        sizeClasses[size],
        className
      )}
    />
  )
}

interface LoadingCardProps {
  className?: string
}

export const LoadingCard = ({ className }: LoadingCardProps) => {
  return (
    <div className={cn(
      'bg-[#161b22] border border-[#30363d] rounded-lg p-4 animate-pulse',
      className
    )}>
      <div className="space-y-3">
        <div className="h-6 bg-gray-700 rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="h-8 bg-gray-700 rounded w-1/4 ml-auto"></div>
      </div>
    </div>
  )
}

interface LoadingTableProps {
  rows?: number
  columns?: number
}

export const LoadingTable = ({ rows = 5, columns = 6 }: LoadingTableProps) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#30363d]">
        <div className="h-5 bg-gray-700 rounded w-1/4 animate-pulse"></div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#0d1117] border-b border-[#30363d]">
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn(
                  'border-b border-[#21262d]',
                  rowIndex % 2 === 0 ? 'bg-[#0d1117]/20' : 'bg-transparent'
                )}
              >
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-4 py-3">
                    <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorMessage = ({ message, onRetry, className }: ErrorMessageProps) => {
  return (
    <div className={cn(
      'bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-center',
      className
    )}>
      <div className="text-red-400 mb-2">⚠️ Error</div>
      <p className="text-gray-300 mb-3">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  )
}