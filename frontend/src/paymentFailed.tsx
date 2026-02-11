import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">

        <h2 className="text-xl font-bold text-red-600 mb-4">
          Payment Failed For further assistance Please call us at +91 9731312275 +91 8197882511
        </h2>

        <p className="text-gray-700 text-xl mb-6">
          Unfortunately, your payment could not be completed.
        </p>

        {/* <p className="text-gray-600 mb-8">
          For further assistance Please call us at +91 9731312275 +91 8197882511
        </p> */}

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold transition"
          onClick={() => navigate("/")}
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default PaymentFailed;
