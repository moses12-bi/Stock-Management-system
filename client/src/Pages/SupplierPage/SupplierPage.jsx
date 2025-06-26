import React, { useEffect, useState } from "react";
import SupplierTable from "../../Components/SupplierTable/SupplierTable";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import AddSupplierModal from "../../Components/AddSupplierModal/AddSupplierModal";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import {
  CreateSupplier,
  AllSuppliers,
} from "../../Services/SupplierService";

import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import NavBar from "../../Components/NavBar/NavBar";
import { useAuth } from "../../contexts/useAuth";

const SupplierPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const CloseModal = async (addSupplierDto) => {
    setModalOpen(false);
    if (addSupplierDto) {
      try {
        const response = await CreateSupplier(addSupplierDto);
        if (reponse) {
          setSuppliers([...suppliers, reponse]);
          showSuccessModal();
        } else {
          showErrorModal();
        }
      } catch (error) {
        showErrorModal();
      }
    }
  };

  useEffect(() => {
    const GetAllSuppliers = async () => {
      setLoading(true);
      const results = await AllSuppliers();
      setSuppliers(results);
      setLoading(false);
    };
    GetAllSuppliers();
  }, []);

  return (
    <div className="w-full m-0">
      <div className="pt-36 px-2">
        <div className="flex justify-end py-4 container mx-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 font-medium rounded"
          >
            Add Supplier
          </button>
        </div>
        {isLoading ? (
          <TableSkeleton isLoading={isLoading} />
        ) : (
          <SupplierTable suppliers={suppliers} />
        )}
      </div>
      {isModalOpen && (
        <AddSupplierModal
          isOpen={isModalOpen}
          onClose={CloseModal}
        />
      )}
    </div>
  );
};

export default SupplierPage;
