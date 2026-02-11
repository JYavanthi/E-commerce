// import { ChevronRight } from "lucide-react";

// const PaymentOptions = () => {
//   const paymentMethods = [
//     {
//       title: "UPI Options",
//       subtitle: "Pay Directly From Your Bank Account", 
//       icon: (
//        <div className="w-9 h-9 rounded-lg flex items-center justify-center" >
//   <img
//     src="https://imgak.mmtcdn.com/payment-ui-service/images/payment/upi_paymode.png"
//     alt="UPI"
//     width={20}
//     height={20}
//   />
// </div>

//       )
//     },
//     {
//       title: "Credit & Debit Cards",
//       subtitle: "Visa, Mastercard, Amex, Rupay and more",
//       icon: (
//        <div className="w-9 h-9 rounded-lg flex items-center justify-center" >
//   <img
//     src="https://imgak.mmtcdn.com/payment-ui-service/images/payment/card_paymode_new.png"
//     alt="UPI"
//     width={20}
//     height={20}
//   />
// </div>
//       )
//     },
//     {
//       title: "Pay Later", 
//       subtitle: "Simpl, Lazypay",
//       icon: (
//         <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{backgroundColor: '#cccccc'}}>
//           <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
//             <circle cx="9" cy="9" r="7" stroke="white" strokeWidth="2"/>
//             <path d="M9 5v4l3 3" stroke="white" strokeWidth="2"/>
//           </svg>
//         </div>
//       )
//     },
//     {
//       title: "Net Banking",
//       subtitle: "40+ Banks Available",
//       icon: (
//         <div className="w-9 h-9 rounded-lg flex items-center justify-center" >
//   <img
//     src="https://imgak.mmtcdn.com/payment-ui-service/images/payment/netbanking_paymode_new.png"
//     alt="UPI"
//     width={20}
//     height={20}
//   />
// </div>
//       )
//     },
//     {
//       title: "EMI",
//       subtitle: "Credit/Debit Card & Cardless EMI available", 
//       icon: (
//         <div className="w-9 h-9 rounded-lg flex items-center justify-center" >
//   <img
//     src="https://imgak.mmtcdn.com/payment-ui-service/images/payment/emi_paymode_new.png"
//     alt="UPI"
//     width={20}
//     height={20}
//   />
// </div>
//       )
//     },
//     {
//       title: "Gift Cards & e-wallets",
//       subtitle: "MMT Gift cards & Amazon Pay",
//       icon: (
//         <div className="w-9 h-9 rounded-lg flex items-center justify-center" >
//   <img
//     src="https://imgak.mmtcdn.com/payment-ui-service/images/payment/wallet_paymode_new.png"
//     alt="UPI"
//     width={20}
//     height={20}
//   />
// </div>
//       )
//     },
//     {
//       title: "GooglePay",
//       subtitle: "Pay with GooglePay",
//       icon: (
//          <div className="w-9 h-9 rounded-lg flex items-center justify-center" >
//   <img
//     src="https://imgak.mmtcdn.com/payment-ui-service/images/payment/gpay.png"
//     alt="UPI"
//     width={20}
//     height={20}
//   />
// </div>
//       )
//     }
//   ];

//   return (
//     <div className="bg-white rounded-lg border p-5" style={{borderColor: '#e0e0e0', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
//       <h3 className="font-semibold mb-4 text-sm" style={{color: '#333'}}>Payment Options</h3>
      
//       <div className="space-y-0">
//         {paymentMethods.map((method, index) => (
//           <div 
//             key={index}
//             className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer group transition-colors border-b last:border-b-0"
//             style={{borderColor: '#f5f5f5'}}
//           >
//             <div className="flex items-center space-x-3">
//               {method.icon}
//               <div>
//                 <h4 className="font-medium text-sm" style={{color: '#333'}}>{method.title}</h4>
//                 <p className="text-xs" style={{color: '#666'}}>{method.subtitle}</p>
//               </div>
//             </div>
            
//             <ChevronRight className="w-4 h-4" style={{color: '#ccc'}} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default PaymentOptions;

// import "../styles/payment.css";
// import upi from "../assets/upi_paymode.png";
// import card from "../assets/card_paymode_new.png";
// import netbnkng from "../assets/netbanking_paymode_new.png";
// import wallet from "../assets/wallet_paymode_new.png";
// import cod from "../assets/cod.png";

// const PaymentOptions = () => {
//   const paymentMethods = [
//     { img:upi,title: "Pay with any UPI App", subtitle: "GooglePay, PhonePe, Paytm" },
//     { img:card,title: "Credit / Debit Card", subtitle: "Visa, Mastercard, Rupay" },
//     { img:netbnkng,title: "Net Banking", subtitle: "All major banks supported" },
//     {img:cod,title: "C O D",subtitle:"Cash On Delivery"}
//   ];

//   return (
//     <>
//     <div className="payment-box">
//       {paymentMethods.map((method, index) => (
//         <div key={index} className="payment-option">
//           <div>
//             <img src={method.img} alt="method-icon" className="pay-icon" />
//           </div>  
//           <div>
//             <h4>{method.title}</h4>
//             <p>{method.subtitle}</p>
//           </div>
//           <div className="payment-select">  
//             <input type="radio"  readOnly aria-label=".."/>
//           </div>
//         </div>
//       ))}
//     </div>
//     </>
//   );
// };

// export default PaymentOptions;


import "../styles/payment.css";
import upi from "../assets/upi_paymode.png";
import card from "../assets/card_paymode_new.png";
import netbnkng from "../assets/netbanking_paymode_new.png";
import cod from "../assets/cod.png";

type PaymentOptionsProps = {
  selectedMethod: string;
  setSelectedMethod: React.Dispatch<React.SetStateAction<string>>;
};
const PaymentOptions = ({ selectedMethod, setSelectedMethod }: PaymentOptionsProps) => {

  const paymentMethods = [
    { id: "upi", img: upi, title: "Pay with any UPI App", subtitle: "GooglePay, PhonePe, Paytm" },
    { id: "card", img: card, title: "Credit / Debit Card", subtitle: "Visa, Mastercard, Rupay" },
    { id: "netbanking", img: netbnkng, title: "Net Banking", subtitle: "All major banks supported" },
    { id: "cod", img: cod, title: "C O D", subtitle: "Cash On Delivery" }
  ];

  return (
    <div className="payment-box">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          className={`payment-option ${selectedMethod === method.id ? "active" : ""}`}
          onClick={() => setSelectedMethod(method.id)}
        >
          <div>
            <img src={method.img} alt="method-icon" className="pay-icon" />
          </div>

          <div>
            <h4>{method.title}</h4>
            <p>{method.subtitle}</p>
          </div>

          <div className="payment-select">
            <input
              type="radio"
              name="paymentMethod"          /* same name = only one selected */
              checked={selectedMethod === method.id}
              onChange={() => setSelectedMethod(method.id) }
           aria-label=".." />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PaymentOptions;
