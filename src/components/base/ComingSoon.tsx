
interface ComingSoonProps {
  children?: React.ReactNode;
}

const ComingSoon = ({ children }: ComingSoonProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <h2 className="text-xl font-bold mb-1">Coming Soon!</h2>
      <div className="text-center text-sm text-gray-500">
        {children || "This feature is under development and will be available in a future update."}
      </div>
    </div>
  )
}

export default ComingSoon
