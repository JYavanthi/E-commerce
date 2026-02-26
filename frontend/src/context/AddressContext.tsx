// import React, { createContext, useContext, useState } from "react";

// export type AddressType = {
//   id: number;
//   name: string;
//   type: string;
//   address: string;
//   mobile: string;
//   flat:string;
//   street:string,
//   city:string,
//   state:string,
//   pincode:string,
// };

// type AddressContextType = {
//   addresses: AddressType[];
//   selectedAddress: AddressType | null;
//   selectAddress: (address: AddressType) => void;
//   addAddress: (address: AddressType) => void;
//   updateAddress: (address: AddressType) => void;
//   deleteAddress: (id: number) => void;
// };

// const AddressContext = createContext<AddressContextType | null>(null);

// export const AddressProvider = ({ children }: { children: React.ReactNode }) => {
//   const [addresses, setAddresses] = useState<AddressType[]>([
//     {
//       id: 1,
//       name: "Madhusudan M N",
//       type: "HOME",
//       address: "",
//       mobile: "9812345678",
//       flat:"10",
//       street:" 4th main Shankarnagar, Mahalakshmi Layout",
//       city:"Bengaluru",
//       state:"",
//       pincode:"560096"
//     },
//   ]);
 
//   const [selectedAddress, setSelectedAddress] =
//     useState<AddressType | null>(null);

//   const selectAddress = (address: AddressType) => {
//     setSelectedAddress(address);
//   };

//   const addAddress = (address: AddressType) => {
//     setAddresses((prev) => [...prev, address]);
//   };

//   const updateAddress = (updated: AddressType) => {
//     setAddresses((prev) =>
//       prev.map((a) => (a.id === updated.id ? updated : a))
//     );

//     // keep selection updated
//     if (selectedAddress?.id === updated.id) {
//       setSelectedAddress(updated);
//     }
//   };

//   const deleteAddress = (id: number) => {
//     setAddresses((prev) => prev.filter((a) => a.id !== id));
//     if (selectedAddress?.id === id) {
//       setSelectedAddress(null);
//     }
//   };

//   return (
//     <AddressContext.Provider
//       value={{
//         addresses,
//         selectedAddress,
//         selectAddress,
//         addAddress,
//         updateAddress,
//         deleteAddress,
//       }}
//     >
//       {children}
//     </AddressContext.Provider>
//   );
// };

// export const useAddress = () => {
//   const context = useContext(AddressContext);
//   if (!context) {
//     throw new Error("useAddress must be used within AddressProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Landmark } from "lucide-react";

export type AddressType = {
  id: number;
  name: string;
  type: string;
  mobile: string;
  flat: string;
  street: string;
  landmark:string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

type AddressContextType = {
  addresses: AddressType[];
  selectedAddress: AddressType | null;
  loading: boolean;
  selectAddress: (address: AddressType) => void;
  fetchAddresses: (userId: number) => Promise<void>;
  addAddress: (userId: number, address: Omit<AddressType, "id">) => Promise<void>;
  updateAddress: (userId: number, address: AddressType) => Promise<void>;
  deleteAddress: (id: number) => Promise<void>;
};

const AddressContext = createContext<AddressContextType | null>(null);

export const AddressProvider = ({ children }: { children: React.ReactNode }) => {
  const [addresses, setAddresses] = useState<AddressType[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:4000/api/address";

  // ✅ Fetch Addresses
  // const fetchAddresses = async (userId: number) => {
  //   try {
  //     setLoading(true);
  //     const res = await axios.get(`${API_BASE}/${userId}`);

  //     const formatted = res.data.data.map((item: any) => ({
  //       id: item.AddressID,
  //       name: item.FullName,
  //       mobile: item.MobileNumber,
  //       flat: item.AddressLine1,
  //       street: item.AddressLine2,
  //       city: item.City,
  //       state: item.State,
  //       pincode: item.Pincode,
  //       type: item.AddressType,
  //       isDefault: item.IsDefault,
  //     }));

  //     setAddresses(formatted);

  //     const defaultAddress = formatted.find((a: AddressType) => a.isDefault);
  //     if (defaultAddress) setSelectedAddress(defaultAddress);

  //   } catch (err) {
  //     console.error("Failed to load addresses", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const fetchAddresses = async (userId: number) => {
  try {
    setLoading(true);

    const res = await axios.get(`${API_BASE}/${userId}`);

    const formatted = res.data.data.map((item: any) => ({
      id: item.AddressID,
      name: item.FullName,
      mobile: item.MobileNumber,
      flat: item.AddressLine1,
      street: item.AddressLine2,
      landmark:item.Landmark,
      city: item.City,
      state: item.State,
      pincode: item.Pincode,
      type: item.AddressType,
      isDefault: item.IsDefault,
    }));

    setAddresses(formatted);

    // ✅ IMPORTANT FIX
    if (formatted.length === 0) {
      setSelectedAddress(null);
    } else {
      const defaultAddress = formatted.find((a: any) => a.isDefault);
      setSelectedAddress(defaultAddress || null);
    }

  } catch (err) {
    console.error("Failed to load addresses", err);
    setSelectedAddress(null);
  } finally {
    setLoading(false);
  }
};

  // ✅ Select
  const selectAddress = (address: AddressType) => {
    setSelectedAddress(address);
  };

  // ✅ Add Address
  const addAddress = async (userId: number, address: Omit<AddressType, "id">) => {
    try {
      await axios.post(API_BASE, {
        userId,
        name: address.name,
        mobile: address.mobile,
        flat: address.flat,
        street: address.street,
        landmark:address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type,
        isDefault: address.isDefault || false,
      });

      await fetchAddresses(userId); // refresh list

    } catch (err) {
      console.error("Failed to add address", err);
    }
  };

  // ✅ Update Address
  const updateAddress = async (userId: number, address: AddressType) => {
    try {
      await axios.put(`${API_BASE}/${address.id}`, {
        userId,
        name: address.name,
        mobile: address.mobile,
        flat: address.flat,
        street: address.street,
        landmark:address.landmark,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type,
        isDefault: address.isDefault || false,
      });

      await fetchAddresses(userId);

    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  // ✅ Delete Address
  const deleteAddress = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));

      if (selectedAddress?.id === id) {
        setSelectedAddress(null);
      }

    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        selectedAddress,
        loading,
        selectAddress,
        fetchAddresses,
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