import React, { useState, useEffect } from 'react';
import ProductService from "../../Services/ProductService";
import { useAuth } from '../../contexts/useAuth';
import { useToast } from '../../contexts/ToastContext';
import AddProductModal from '../AddProductModal/AddProductModal';
import TableSkeleton from '../TableSkeleton/TableSkeleton';

const ProductTable = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    supplier: '',
    price: '',
    quantity: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await ProductService.getAllProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message || 'Failed to load products');
      showToast('error', err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category?.name || '',
      supplier: product.supplier?.name || '',
      price: product.price,
      quantity: product.quantity
    });
  };

  const handleCloseModal = async (productData) => {
    setModalOpen(false);
    if (productData) {
      try {
        if (editingProduct) {
          await ProductService.updateProduct(editingProduct.id, productData);
          showToast('success', 'Product updated successfully');
        } else {
          await ProductService.createProduct(productData);
          showToast('success', 'Product created successfully');
        }
        fetchProducts();
      } catch (error) {
        showToast('error', error.message || 'Failed to save product');
      }
    }
    setEditingProduct(null);
    setFormData({
      name: '',
      category: '',
      supplier: '',
      price: '',
      quantity: ''
    });
  };

  const handleDeleteProduct = async (id) => {
    try {
      await ProductService.deleteProduct(id);
      showToast('success', 'Product deleted successfully');
      fetchProducts();
    } catch (error) {
      showToast('error', error.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return <TableSkeleton isLoading={loading} />;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-end py-4">
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 font-medium rounded"
        >
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.supplier?.name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">${product.price}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleAddProduct(product)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <AddProductModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialData={editingProduct ? formData : null}
        />
      )}
    </div>
  );
};

export default ProductTable;
