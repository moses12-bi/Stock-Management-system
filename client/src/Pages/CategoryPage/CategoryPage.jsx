import React, { useEffect, useState } from "react";
import CategoryTable from "../../Components/CategoryTable/CategoryTable";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import CategoryService from "../../Services/CategoryService";
import { useToast } from "../../contexts/ToastContext";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { showToast } = useToast();

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching categories...");
      const results = await CategoryService.getAllCategories();
      console.log("Fetched categories:", results);
      setCategories(results);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setErrorMessage(error.message);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoriesChange = () => {
    fetchCategories();
  };

  return (
    <div className="w-full m-0">
      <div>
        <div className="pt-36 px-2">
          {isLoading ? (
            <TableSkeleton isLoading={isLoading} />
          ) : (
            <CategoryTable 
              categories={categories} 
              onCategoriesChange={handleCategoriesChange}
            />
          )}
        </div>
      </div>
      {showSuccess && (
        <SuccessDialog 
          message="Category created successfully!" 
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

export default CategoryPage;
