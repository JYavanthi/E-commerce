// const PaymentFooter = () => {
//   return (
//     <footer className="mt-6 py-4">
//       <div className="flex items-center justify-between max-w-none mx-auto px-4">
//         {/* Security Badge */}
//         <div className="flex items-center space-x-3">
//           <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#16a085'}}>
//             <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
//               <path d="M5.5 9L2 5.5L3 4.5L5.5 7L13 0L14 1L5.5 9Z" fill="white"/>
//             </svg>
//           </div>
//           <div>
//             <div className="font-semibold text-xs" style={{color: '#16a085'}}>BRIHATI IS SECURED</div>
//             <div className="text-xs" style={{color: '#666'}}>100% RBI Compliant</div>
//           </div>
//         </div>
        
//         {/* Payment Security Logos */}
//         <div className="flex items-center space-x-2">
//           <div className="w-10 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor: '#1976d2'}}>
//              <div className="w-12 h-6 rounded flex items-center justify-center text-white text-xs font-bold" >
           
//            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXWDGocTFM3uZvYetr4v11JozAP8qcDTBEHA&s"
//             width={20}
//             height={20} />
//           </div>
//           </div>
          
//           <div className="w-8 h-6 rounded-full flex items-center justify-center" style={{backgroundColor: '#4caf50'}}>
//             <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
//               <path d="M4 6.5L1.5 4L2.5 3L4 4.5L9.5 0L10.5 1L4 6.5Z" fill="white"/>
//             </svg>
//           </div>
          
//           <div className="w-12 h-6 rounded flex items-center justify-center text-white text-xs" style={{backgroundColor: '#1976d2'}}>
//             Verified by
//           </div>
          
//           <div className="w-12 h-6 rounded flex items-center justify-center text-white text-xs font-bold" >
           
//            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png"
//             width={20}
//             height={20} />
//           </div>
          
//           <div className="w-10 h-6 rounded flex items-center justify-center text-white text-xs font-bold" style={{backgroundColor: '#424242'}}>
//             SafeKey
//           </div>
//         </div>
//       </div>
      
//       {/* Terms and Privacy */}
//       <div className="mt-3 text-center text-xs" style={{color: '#666'}}>
//         <span>By continuing to pay, I understand and agree with the </span>
//         <a href="#" style={{color: '#4a90e2'}}>Terms of Service</a>
//         <span>, </span>
//         <a href="#" style={{color: '#4a90e2'}}>Privacy Policy</a>
//         <span> and </span>
//         <a href="#" style={{color: '#4a90e2'}}>User Agreement</a>
//         <span> of MakeMyTrip.</span>
//       </div>
//     </footer>
//   );
// };

// export default PaymentFooter;

import "../styles/payment.css";

const PaymentFooter = () => {
  return (
    <footer className="payment-footer">

      <div className="security-row">
        <div className="secure-badge">✔</div>
        <div>
          <div className="secure-title">BRIHATI IS SECURED</div>
          <div className="secure-sub">100% RBI Compliant</div>
        </div>
      </div>

      <div className="footer-text">
        By continuing to pay, you agree to our
        <span> Terms of Service</span>, 
        <span> Privacy Policy</span> and 
        <span> User Agreement</span>.
      </div>

    </footer>
  );
};

export default PaymentFooter;
