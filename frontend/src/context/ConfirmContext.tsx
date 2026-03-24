import React, { createContext, useContext, useRef, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

interface ConfirmOptions {
  title: string;
  subText?: string;
  confirmText?: string;
  cancelText?: string;
  image?: string;
   variant?: "default" | "logout" | "delete" | "recovery" | "success" |"address";
}

interface ConfirmContextType {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions>({
    title: "",
    subText: "",
    confirmText: "Yes",
    cancelText: "No",
    image: "",
     variant: "default" ,
  });

  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = (confirmOptions: ConfirmOptions): Promise<boolean> => {
    setOptions({
      title: confirmOptions.title,
      subText: confirmOptions.subText || "",
      confirmText: confirmOptions.confirmText || "Yes",
      cancelText: confirmOptions.cancelText || "No",
      image: confirmOptions.image || "",
       variant: confirmOptions.variant || "default",
    });

    setOpen(true);

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  };

  const handleCancel = () => {
    setOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      <ConfirmModal
        open={open}
        title={options.title}
        subText={options.subText}
        confirmText={options.confirmText}
        cancelText={options.cancelText}
        image={options.image}
        variant={options.variant}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmContextType => {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used inside ConfirmProvider");
  }

  return context;
};