import React, { useState, useEffect } from 'react';
import axios from '../utils/axios.jsx';

const Checklist = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [newProductName, setNewProductName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/products/get-products", {
        withCredentials: true,
      });
      setProducts(response.data);
      // Initialize remarks state with existing remarks
      const initialRemarks = {};
      response.data.forEach(product => {
        initialRemarks[product._id] = product.remarks || '';
      });
      setRemarks(initialRemarks);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (productId, status) => {
    try {
      setLoading(true);
      const currentRemarks = remarks[productId] || "";
      
      // Always include remarks in the payload
      const payload = {
        productId,
        status,
        remarks: currentRemarks
      };

      const response = await axios.post("/products/set-products-status", payload, {
        withCredentials: true,
      });

      // Update the products state with the new status and remarks
      setProducts(products.map(product => {
        if (product._id === productId) {
          return { 
            ...product, 
            status,
            remarks: currentRemarks
          };
        }
        return product;
      }));

    } catch (error) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  const handleRemarksChange = (productId, newRemarks) => {
    setRemarks(prev => ({
      ...prev,
      [productId]: newRemarks
    }));
  };

  const handleSaveRemarks = async (productId) => {
    try {
      setLoading(true);
      const product = products.find(p => p._id === productId);
      if (!product) return;

      const payload = {
        productId,
        status: product.status,
        remarks: remarks[productId] || ''
      };
      const response = await axios.post("/products/set-products-status", payload, {
        withCredentials: true,
      });

      console.log(response);

      // Update the products state with the new remarks
      setProducts(products.map(p => {
        if (p._id === productId) {
          return { 
            ...p, 
            remarks: remarks[productId] || ''
          };
        }
        return p;
      }));

    } catch (error) {
      alert(error.response?.data?.message || "Failed to save remarks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductName.trim()) {
      alert("Please enter a product name");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/products/create-product", 
        { name: newProductName },
        { withCredentials: true }
      );
      
      setNewProductName('');
      setShowAddForm(false);
      getProducts(); // Refresh the product list
      alert("Product created successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      setLoading(true);
      await axios.post("/products/delete-product", 
        { productId },
        { withCredentials: true }
      );
      
      setProducts(products.filter(product => product._id !== productId));
      alert("Product deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Product Management</h2>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>

        {showAddForm && (
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <form onSubmit={handleCreateProduct} className="flex gap-4">
              <input
                type="text"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                placeholder="Enter product name"
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Create Product
              </button>
            </form>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Item Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                  OK
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Unfinished
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Not OK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Remark
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product, index) => (
                <tr key={product._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`status-${product._id}`}
                      checked={product.status === "OK"}
                      onChange={() => handleStatusChange(product._id, "OK")}
                      className="form-radio h-4 w-4 text-blue-600"
                      disabled={loading}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`status-${product._id}`}
                      checked={product.status === "Unfinished"}
                      onChange={() => handleStatusChange(product._id, "Unfinished")}
                      className="form-radio h-4 w-4 text-blue-600"
                      disabled={loading}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="radio"
                      name={`status-${product._id}`}
                      checked={product.status === "Not OK"}
                      onChange={() => handleStatusChange(product._id, "Not OK")}
                      className="form-radio h-4 w-4 text-blue-600"
                      disabled={loading}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(product.status === "Not OK" || product.status === "Unfinished") && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={remarks[product._id] || ""}
                          onChange={(e) => handleRemarksChange(product._id, e.target.value)}
                          className="px-2 py-1 border rounded-md w-full max-w-xs"
                          placeholder="Enter remarks..."
                        />
                        <button
                          onClick={() => handleSaveRemarks(product._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                          disabled={loading}
                        >
                          Save
                        </button>
                      </div>
                    )}
                    {product.status === "OK" && product.remarks && (
                      <span className="text-sm text-gray-500">
                        {product.remarks}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-center py-4">{error}</div>
        )}
      </div>
    </div>
  );
};

export default Checklist;