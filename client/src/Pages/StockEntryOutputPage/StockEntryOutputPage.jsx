import React, { useEffect, useState } from "react";
import FluxTable from "../../Components/FluxTable/FluxTable";
import AddStockEntryModal from "../../Components/AddStockEntryModal/AddStockEntryModal";
import AddStockExitModal from "../../Components/AddStockExitModal/AddStockExitModal";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import { GetAllIOStock } from "../../Services/StockService";
import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import NavBar from "../../Components/NavBar/NavBar";
import { useAuth } from "../../contexts/useAuth";

const StockEntryOutputPage = () => {
  const [ioStock, setIOStock] = useState([]);
  const [isEntryModalOpen, setEntryModalOpen] = useState(false);
  const [isExitModalOpen, setExitModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchIOStock = async () => {
      setLoading(true);
      const results = await GetAllIOStock();
      setIOStock(results);
      setLoading(false);
    };
    fetchIOStock();
  }, []);

  const CloseEntry = async (entryData) => {
    setEntryModalOpen(false);
    if (entryData) {
      try {
        // Handle entry data
        showSuccessModal();
      } catch (error) {
        showErrorModal();
      }
    }
  };

  const CloseExit = async (exitData) => {
    setExitModalOpen(false);
    if (exitData) {
      try {
        // Handle exit data
        showSuccessModal();
      } catch (error) {
        showErrorModal();
      }
    }
  };

  return (
    <div className="w-full m-0">
      <div>
        <div className="pt-36 px-2">
          <div className="flex justify-end gap-5 items-center py-4 container mx-auto">
            <button
              onClick={() => setEntryModalOpen(true)}
              className="bg-green-500 hover:bg-green-700 text-white px-3 py-2 font-medium rounded"
            >
              Report Entry
            </button>
            <button
              onClick={() => setExitModalOpen(true)}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 font-medium rounded"
            >
              Report Exit
            </button>
          </div>
          {isLoading ? (
            <TableSkeleton isLoading={isLoading} />
          ) : (
            <FluxTable iOStock={ioStock} />
          )}
        </div>
      </div>
      {isEntryModalOpen && (
        <AddStockEntryModal
          isOpen={isEntryModalOpen}
          onClose={CloseEntry}
        />
      )}
      {isExitModalOpen && (
        <AddStockExitModal
          isOpen={isExitModalOpen}
          onClose={CloseExit}
        />
      )}
    </div>
  );
};

export default StockEntryOutputPage;
