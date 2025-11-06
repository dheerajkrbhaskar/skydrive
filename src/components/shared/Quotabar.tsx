import { useUserContext } from '@/context/AuthContext.tsx'
import React from 'react'

const Quotabar = () => {
  const { user } = useUserContext()
  const usedStorage = user?.usedStorage ? user.usedStorage / (1024 * 1024) : 0
  const totalStorage = user?.totalStorage ? user.totalStorage / (1024 * 1024) : 1
  const percentageUsed = Math.min((usedStorage / totalStorage) * 100, 100)

  const barColor =
    percentageUsed < 60 ? "bg-blue-500"
      : percentageUsed < 90 ? "bg-yellow-500"
        : "bg-red-500"

  return (
    <div className="w-full mt-2 px-3 py-2 rounded-xl shadow-lg">
      <p className="text-xl text-gray-400 mb-1">Storage</p>
      <div className="h-2 w-full bg-dark-4 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all duration-700 ease-in-out`}
          style={{ width: `${percentageUsed}%` }}
        />
      </div>
      <p className="text-[14px] text-gray-400 mt-1">
        {usedStorage.toFixed(2)} MB of {totalStorage.toFixed(2)} MB used
      </p>
    </div>
  )
}

export default Quotabar
