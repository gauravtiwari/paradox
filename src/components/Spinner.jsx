export default function Spinner({ size = "md" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-gray-900 ${sizeClasses[size]}`}></div>
  );
} 
