export default function StatusBadge({ status }: { status: string }) {
  const map: any = {
    PLACED: "bg-gray-100 text-gray-700",
    CONFIRMED: "bg-blue-100 text-blue-700",
    PACKED: "bg-yellow-100 text-yellow-700",
    OUT_FOR_DELIVERY: "bg-purple-100 text-purple-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700"
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]}`}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}
