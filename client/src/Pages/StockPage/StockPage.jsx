import React, { useEffect, useState } from "react";
import ProductTable from "../../Components/ProductTable/ProductTable";
import AddProductModal from "../../Components/AddProductModal/AddProductModal";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import { AllProducts, CreateProduct } from "../../Services/ProductService";
import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import { useAuth } from "../../contexts/useAuth";
import SideNav from "../../Components/SideNav/SideNav";
import NavBar from "../../Components/NavBar/NavBar";

const StockPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const GetAllProducts = async () => {
      setLoading(true);
      const results = await AllProducts();
      setProducts(results);
      setLoading(false);
    };
    GetAllArticles();
  }, []);

  const CloseModal = async (addProductDto) => {
    setModalOpen(false);
    if (addProductDto) {
      try {
        const response = await CreateProduct(addProductDto);
        if (reponse) {
          setProducts([...products, response]);
          showSuccessModal();
        } else {
          showErrorModal();
        }
      } catch (error) {
        showErrorModal();
      }
    }
  };

  return (
    <div className={`w-full m-0 ${isLoggedIn() ? "ps-64" : "p-0"}`}>
      {isLoggedIn() ? <SideNav /> : null}
      <NavBar />
      <div className="pt-36 px-2">
        <div className="flex justify-end py-4 container mx-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 font-medium rounded"
          >
            Add Product
          </button>
        </div>
        {isLoading ? (
          <TableSkeleton isLoading={isLoading} />
        ) : (
          <ProductTable products={products} />
        )}
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={CloseModal}
      />
      {/* {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
      {showError && <ErrorDialog onClose={() => setShowError(false)} />} */}
    </div>
  );
};

export default StockPage;
