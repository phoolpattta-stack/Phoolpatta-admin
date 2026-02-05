
// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { getAdminOrderById, updateAdminOrderStatus } from "@/services/api";
// import StatusBadge from "@/components/StatusBadge";

// const STATUS_ORDER = [
//   "PLACED",
//   "CONFIRMED",
//   "OUT_FOR_DELIVERY",
//   "DELIVERED",
// ];

// const TERMINAL_STATUSES = ["DELIVERED", "CANCELLED"];

// export default function OrderDetails() {
//   const { id } = useParams();
//   const [order, setOrder] = useState<any>(null);
//   const [saving, setSaving] = useState(false);
//   const [message, setMessage] = useState("");

//   const loadOrder = async () => {
//     const res = await getAdminOrderById(id as string);
//     setOrder(res.data);
//   };

//   useEffect(() => {
//     loadOrder();
//   }, []);

//   if (!order) return <div className="p-6">Loading…</div>;

//   const currentIndex = STATUS_ORDER.indexOf(order.orderStatus);
//   const nextStatus =
//     currentIndex >= 0 && currentIndex < STATUS_ORDER.length - 1
//       ? STATUS_ORDER[currentIndex + 1]
//       : null;

//   const canUpdate =
//     nextStatus && !TERMINAL_STATUSES.includes(order.orderStatus);

//   const updateStatus = async () => {
//     if (!nextStatus) return;

//     try {
//       setSaving(true);
//       setMessage("");
//       await updateAdminOrderStatus(id as string, nextStatus);
//       setMessage("Order status updated");
//       loadOrder();
//     } catch {
//       setMessage("Failed to update order");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="p-4 md:p-6 max-w-4xl mx-auto">
//       <h1 className="text-xl font-bold mb-6">Order Details</h1>

//       {/* ORDER INFO */}
//       <div className="bg-white p-4 rounded shadow text-sm space-y-2 mb-6">
//         <p><b>Order ID:</b> {order._id}</p>
//         <p><b>Name:</b> {order.deliveryAddress.fullName}</p>
//         <p><b>Phone:</b> {order.deliveryAddress.phone}</p>
//         <p><b>Amount:</b> ₹{order.finalAmount}</p>
//         <p><b>Status:</b> <StatusBadge status={order.orderStatus} /></p>
//       </div>

//       {/* TIMELINE */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="font-semibold mb-4">Order Timeline</h2>

//         <div className="space-y-4">
//           {STATUS_ORDER.map((status, index) => {
//             const isCompleted = index < currentIndex;
//             const isCurrent = index === currentIndex;

//             return (
//               <div key={status} className="flex items-center gap-4">
//                 {/* ICON */}
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
//                     ${
//                       isCompleted
//                         ? "bg-green-500 text-white"
//                         : isCurrent
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-300 text-gray-600"
//                     }
//                   `}
//                 >
//                   {isCompleted ? "✓" : index + 1}
//                 </div>

//                 {/* TEXT */}
//                 <div>
//                   <p className="font-medium">
//                     {status.replaceAll("_", " ")}
//                   </p>
//                   {isCurrent && (
//                     <p className="text-xs text-gray-500">
//                       Current status
//                     </p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ACTION */}
//         {canUpdate && (
//           <button
//             onClick={updateStatus}
//             disabled={saving}
//             className="mt-6 bg-black text-white px-6 py-2 rounded disabled:opacity-50"
//           >
//             {saving
//               ? "Updating…"
//               : `Mark as ${nextStatus.replaceAll("_", " ")}`}
//           </button>
//         )}

//         {!canUpdate && (
//           <p className="mt-6 text-sm text-gray-500">
//             This order is completed and cannot be updated.
//           </p>
//         )}

//         {message && <p className="mt-3 text-sm">{message}</p>}
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getAdminOrderById, updateAdminOrderStatus } from "@/services/api";
import StatusBadge from "@/components/StatusBadge";

const STATUS_ORDER = [
  "PLACED",
  "CONFIRMED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

const TERMINAL_STATUSES = ["DELIVERED", "CANCELLED"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const loadOrder = async () => {
    const res = await getAdminOrderById(id as string);
    setOrder(res.data);
  };

  useEffect(() => {
    loadOrder();
  }, []);

  if (!order) return <div className="p-6">Loading…</div>;

  const currentIndex = STATUS_ORDER.indexOf(order.orderStatus);
  const nextStatus =
    currentIndex >= 0 && currentIndex < STATUS_ORDER.length - 1
      ? STATUS_ORDER[currentIndex + 1]
      : null;

  const canUpdate =
    nextStatus && !TERMINAL_STATUSES.includes(order.orderStatus);

  const updateStatus = async () => {
    if (!nextStatus) return;

    try {
      setSaving(true);
      setMessage("");
      await updateAdminOrderStatus(id as string, nextStatus);
      setMessage("Order status updated");
      loadOrder();
    } catch {
      setMessage("Failed to update order");
    } finally {
      setSaving(false);
    }
  };

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const orderTime = formatDateTime(order.createdAt);

  // Payment method display
  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "RAZORPAY":
        return "Online Payment (Razorpay)";
      case "COD":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  // Payment status color
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-50";
      case "PENDING":
        return "text-yellow-600 bg-yellow-50";
      case "FAILED":
        return "text-red-600 bg-red-50";
      case "CANCELLED":
        return "text-gray-600 bg-gray-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Order Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* ORDER INFO */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow space-y-4">
          <div className="border-b pb-4">
            <h2 className="font-semibold text-lg mb-3">Order Information</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Order ID</p>
                <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                  {order._id}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Order Status</p>
                <StatusBadge status={order.orderStatus} />
              </div>

              <div>
                <p className="text-gray-500 mb-1">Placed On</p>
                <p className="font-medium">{orderTime.date}</p>
                <p className="text-xs text-gray-500">{orderTime.time}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Total Amount</p>
                <p className="font-bold text-lg">₹{order.finalAmount}</p>
              </div>
            </div>
          </div>

          {/* PAYMENT DETAILS */}
          <div className="border-b pb-4">
            <h3 className="font-semibold mb-3">Payment Details</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium">
                  {getPaymentMethodLabel(order.paymentMethod)}
                </p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Payment Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </div>

              {order.paymentMethod === "RAZORPAY" && (
                <>
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Razorpay Order ID</p>
                    <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                      {order.razorpayOrderId || "N/A"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Razorpay Payment ID</p>
                    <p className="font-mono text-xs bg-gray-50 px-2 py-1 rounded">
                      {order.razorpayPaymentId || "N/A"}
                    </p>
                  </div>
                </>
              )}

              <div>
                <p className="text-gray-500 mb-1">Subtotal</p>
                <p>₹{order.subtotal}</p>
              </div>

              <div>
                <p className="text-gray-500 mb-1">Discount</p>
                <p className="text-green-600">- ₹{order.discount || 0}</p>
              </div>
            </div>
          </div>

          {/* DELIVERY ADDRESS */}
          <div>
            <h3 className="font-semibold mb-3">Delivery Address</h3>
            <div className="bg-gray-50 p-4 rounded text-sm">
              <p className="font-medium mb-1">
                {order.deliveryAddress.fullName}
              </p>
              <p className="text-gray-600">{order.deliveryAddress.phone}</p>
              <p className="text-gray-600 mt-2">
                {order.deliveryAddress.street}
              </p>
              <p className="text-gray-600">
                {order.deliveryAddress.city}, {order.deliveryAddress.state}
              </p>
              <p className="text-gray-600">
                {order.deliveryAddress.pincode}, {order.deliveryAddress.country || "India"}
              </p>
            </div>
          </div>

          {/* ORDER ITEMS */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">₹{item.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow sticky top-6">
            <h2 className="font-semibold mb-4">Order Timeline</h2>

            <div className="space-y-4">
              {STATUS_ORDER.map((status, index) => {
                const isCompleted = index < currentIndex;
                const isCurrent = index === currentIndex;

                return (
                  <div key={status} className="flex items-start gap-3">
                    {/* ICON */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1
                        ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }
                      `}
                    >
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    {/* TEXT */}
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {status.replaceAll("_", " ")}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-gray-500 mt-1">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ACTION */}
            <div className="mt-6 pt-6 border-t">
              {canUpdate && (
                <button
                  onClick={updateStatus}
                  disabled={saving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving
                    ? "Updating…"
                    : `Mark as ${nextStatus.replaceAll("_", " ")}`}
                </button>
              )}

              {!canUpdate && (
                <div className="text-sm text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    {order.orderStatus === "DELIVERED"
                      ? "✓ Order completed"
                      : "⚠ Order cancelled"}
                  </p>
                </div>
              )}

              {message && (
                <p
                  className={`mt-3 text-sm text-center p-2 rounded ${
                    message.includes("Failed")
                      ? "bg-red-50 text-red-600"
                      : "bg-green-50 text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}