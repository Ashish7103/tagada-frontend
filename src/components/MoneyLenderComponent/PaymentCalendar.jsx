import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
const API_BASE_URL ="https://tagada.onrender.com";

const PaymentCalendar = ({ loanId, cusId, ppd }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [payments, setPayments] = useState([]);
  const expectedDailyPayment = ppd || 0;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/Calender/payment/history?LoanId=${loanId}&Cus_Id=${cusId}`,
          { withCredentials: true }
        );
        setPayments(response.data.payments || []);
      } catch (err) {
        setPayments([]);
      }
    };
    fetchPayments();
  }, [loanId, cusId]);

  const getPaymentStatus = (date) => {
    const paymentsForDate = payments.filter((p) => new Date(p.PaymentDate).toISOString().split("T")[0] === date.toISOString().split("T")[0]);
    const totalPayment = paymentsForDate.reduce((sum, payment) => sum + parseFloat(payment.Amount || 0), 0);
    if (totalPayment === 0) return { status: "red", amount: 0 };
    if (totalPayment >= expectedDailyPayment) return { status: "green", amount: totalPayment };
    return { status: "yellow", amount: totalPayment };
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const { status, amount } = getPaymentStatus(date);
      return (
        <div className={`w-full h-full flex flex-col items-center justify-center rounded-full text-xs ${status === "green" ? "bg-green-500 text-white" : status === "yellow" ? "bg-yellow-500 text-black" : "bg-red-500 text-white"}`}>
          <span>{amount > 0 ? `₹${amount}` : ""}</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <button onClick={() => setIsPopupOpen(true)} className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none">👁️</button>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={() => setIsPopupOpen(false)}>
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md max-h-[90vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsPopupOpen(false)} className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-900 focus:outline-none">×</button>
            <Calendar onChange={setSelectedDate} value={selectedDate} tileContent={tileContent} className="border rounded-lg w-full" />
            <div className="mt-4 w-3/4 mx-auto text-center">
              <p className="text-sm text-gray-600">Click on a date to view payment details.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCalendar;