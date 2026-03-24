// import React from "react";
// import "./ConfirmModal.css";

// interface ConfirmModalProps {
//   open: boolean;
//   title: string;
//   subText?: string;
//   confirmText?: string;
//   cancelText?: string;
//   image?: string;
//    variant?: "default" | "logout" | "delete";
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// const ConfirmModal: React.FC<ConfirmModalProps> = ({
//   open,
//   title,
//   subText,
//   confirmText = "Yes",
//   cancelText = "No",
//   image,
//   onConfirm,
//   onCancel,
// }) => {
//   if (!open) return null;

//   return (
//     <div className="confirm-overlay">
//       <div className="confirm-box">
//         <button className="confirm-close" onClick={onCancel}>
//           ×
//         </button>

//         <div className="confirm-content">
//           {image && (
//             <div className="confirm-image-section">
//               <img src={image} alt="confirm" className="confirm-image" />
//             </div>
//           )}

//           <div className="confirm-text-section">
//             <h2 className="confirm-title">{title}</h2>

//             {subText && <p className="confirm-subtext">{subText}</p>}

//             <div className="confirm-buttons">
//               <button className="confirm-yes-btn" onClick={onConfirm}>
//                 {confirmText}
//               </button>

//               <button className="confirm-no-btn" onClick={onCancel}>
//                 {cancelText}
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmModal;


import React from "react";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  subText?: string;
  confirmText?: string;
  cancelText?: string;
  image?: string;
  variant?: "default" | "logout" | "delete" |"recovery" |"success"|"address";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  subText,
  confirmText = "Yes",
  cancelText = "No",
  image,
  variant = "default",
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  return (
    <div className="confirm-overlay">
      <div className={`confirm-box confirm-box-${variant}`}>
        <button className={`confirm-close confirm-close-${variant}`} onClick={onCancel}>
          ×
        </button>

        <div className={`confirm-content confirm-content-${variant}`}>
          {image && (
            <div className={`confirm-image-section confirm-image-section-${variant}`}>
              <img src={image} alt="confirm" className={`confirm-image confirm-image-${variant}`} />
            </div>
          )}

          <div className={`confirm-text-section confirm-text-section-${variant}`}>
            <h2 className={`confirm-title confirm-title-${variant}`}>{title}</h2>

            {subText && (
              <p className={`confirm-subtext confirm-subtext-${variant}`}>
                {subText}
              </p>
            )}

            <div className={`confirm-buttons confirm-buttons-${variant}`}>
              <button className={`confirm-yes-btn confirm-yes-btn-${variant}`} onClick={onConfirm}>
                {confirmText}
              </button>

              <button className={`confirm-no-btn confirm-no-btn-${variant}`} onClick={onCancel}>
                {cancelText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;