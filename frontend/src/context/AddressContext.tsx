import React, { createContext, useContext, useState } from "react";

export type AddressType = {
  id: number;
  name: string;
  type: string;
  address: string;
  mobile: string;
  flat:string;
  street:string,
  city:string,
  state:string,
  pincode:string,
};

type AddressContextType = {
  addresses: AddressType[];
  selectedAddress: AddressType | null;
  selectAddress: (address: AddressType) => void;
  addAddress: (address: AddressType) => void;
  updateAddress: (address: AddressType) => void;
  deleteAddress: (id: number) => void;
};

const AddressContext = createContext<AddressContextType | null>(null);

export const AddressProvider = ({ children }: { children: React.ReactNode }) => {
  const [addresses, setAddresses] = useState<AddressType[]>([
    {
      id: 1,
      name: "Madhusudan M N",
      type: "HOME",
      address: "",
      mobile: "9812345678",
      flat:"10",
      street:" 4th main Shankarnagar, Mahalakshmi Layout",
      city:"Bengaluru",
      state:"",
      pincode:"560096"
    },
  ]);
 
  const [selectedAddress, setSelectedAddress] =
    useState<AddressType | null>(null);

  const selectAddress = (address: AddressType) => {
    setSelectedAddress(address);
  };

  const addAddress = (address: AddressType) => {
    setAddresses((prev) => [...prev, address]);
  };

  const updateAddress = (updated: AddressType) => {
    setAddresses((prev) =>
      prev.map((a) => (a.id === updated.id ? updated : a))
    );

    // keep selection updated
    if (selectedAddress?.id === updated.id) {
      setSelectedAddress(updated);
    }
  };

  const deleteAddress = (id: number) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    if (selectedAddress?.id === id) {
      setSelectedAddress(null);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        selectAddress,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error("useAddress must be used within AddressProvider");
  }
  return context;
};
