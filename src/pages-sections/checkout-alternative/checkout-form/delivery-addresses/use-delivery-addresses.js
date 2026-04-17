import { useState, useCallback } from "react";

// CUSTOM DATA MODEL

export default function useDeliveryAddresses() {
  const [openModal, setOpenModal] = useState(false);
  const [editDeliveryAddress, setEditDeliveryAddress] = useState(undefined);
  const toggleModal = useCallback(() => {
    setOpenModal(prev => !prev);
  }, []);
  const handleDeleteDeliveryAddress = useCallback(id => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      console.log("delete address", id);
    }
  }, []);
  const handleAddNewAddress = useCallback(() => {
    setEditDeliveryAddress(undefined);
    setOpenModal(true);
  }, []);
  const handleEditDeliveryAddress = useCallback(address => {
    setEditDeliveryAddress(address);
    setOpenModal(true);
  }, []);
  return {
    openModal,
    editDeliveryAddress,
    toggleModal,
    handleAddNewAddress,
    handleEditDeliveryAddress,
    handleDeleteDeliveryAddress
  };
}