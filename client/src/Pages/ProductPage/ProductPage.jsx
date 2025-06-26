import React, { useEffect, useState } from "react";
import ProductTable from "../../Components/ProductTable/ProductTable";
import AddProductModal from "../../Components/AddProductModal/AddProductModal";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import ProductService from "../../Services/ProductService";
import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import NavBar from "../../Components/NavBar/NavBar";
import { useAuth } from "../../contexts/useAuth";

const ProductPage = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const results = await ProductService.getAllProducts();
        setProducts(results);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setErrorMessage(error.message);
        setShowError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const CloseModal = async (productData) => {
    setModalOpen(false);
    if (productData) {
      try {
        const response = await ProductService.createProduct(productData);
        if (response) {
          const updatedProducts = await ProductService.getAllProducts();
          setProducts(updatedProducts);
          setShowSuccess(true);
          setErrorMessage("");
        } else {
          setErrorMessage("Failed to create product. Please try again.");
          setShowError(true);
        }
      } catch (error) {
        console.error("Error creating product:", error);
        setErrorMessage(error.message || "An error occurred while creating the product.");
        setShowError(true);
      }
    }
  };

  return (
    <div className="w-full m-0">
      <div>
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
      </div>
      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={CloseModal}
        />
      )}
      {showSuccess && (
        <SuccessDialog 
          message="Product created successfully!" 
          onClose={() => setShowSuccess(false)} 
        />
      )}
      {showError && (
        <ErrorDialog 
          message={errorMessage || "An error occurred. Please try again."} 
          onClose={() => setShowError(false)} 
        />
      )}
    </div>
  );
};

export default ProductPage;
