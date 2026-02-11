import "./styles/payment.css";

type Props = {
  onClose: () => void;
};

const UpiScannerModal = ({ onClose }: Props) => {
  return (
    <div className="upi-modal-overlay">
      <div className="upi-modal-box">
        <h3>Scan & Pay</h3>
        <p>Scan using PhonePe / Google Pay / Paytm</p>

        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=yourupi@bank&pn=DemoStore"
          alt="UPI QR"
          className="upi-qr"
        />

        <button className="upi-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default UpiScannerModal;
