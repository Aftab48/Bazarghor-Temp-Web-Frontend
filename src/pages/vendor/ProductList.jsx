import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import Select from '../../components/Select';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const ProductList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({ categories: {}, subcategories: {} });
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    category: '',
    subcategory: '',
    status: '',
    search: '',
  });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/vendor/login');
      return;
    }

    loadCategories();
    loadProducts();
  }, [navigate, filters]);

  const loadCategories = async () => {
    try {
      const res = await api.products.getCategories();
      if (res.data.code === 'SUCCESS') {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.category) params.category = filters.category;
      if (filters.subcategory) params.subcategory = filters.subcategory;
      if (filters.status) params.status = filters.status;
      if (filters.search) params.search = filters.search;

      const res = await api.products.getAll(params);
      if (res.data.code === 'SUCCESS') {
        setProducts(res.data.data.data || []);
        setPagination(res.data.data.paginator || {});
      }
    } catch (err) {
      console.error('Error loading products:', err);
      alert('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to first page on filter change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await api.products.delete(productId);
      if (res.data.code === 'SUCCESS') {
        alert('Product deleted successfully!');
        loadProducts();
      } else {
        alert(res.data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const categoryOptions = Object.values(categories.categories || {}).map(cat => ({
    value: cat,
    label: cat
  }));

  const subcategoryOptions = Object.values(categories.subcategories || {}).map(sub => ({
    value: sub,
    label: sub
  }));

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'low_stock', label: 'Low Stock' },
  ];

  return (
    <Layout>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>
            Product Inventory
          </h1>
          <Button
            onClick={() => navigate('/vendor/products/create')}
            variant="success"
          >
            + Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem',
          padding: '1rem',
          background: '#f7fafc',
          borderRadius: '8px'
        }}>
          <Input
            label="Search"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search products..."
          />
          <Select
            label="Category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
          />
          <Select
            label="Subcategory"
            name="subcategory"
            value={filters.subcategory}
            onChange={handleFilterChange}
            options={[{ value: '', label: 'All Subcategories' }, ...subcategoryOptions]}
          />
          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            options={statusOptions}
          />
        </div>

        {/* Products List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: '#a0aec0', fontSize: '1.1rem' }}>No products found</p>
            <Button
              onClick={() => navigate('/vendor/products/create')}
              variant="primary"
              style={{ marginTop: '1rem' }}
            >
              Create Your First Product
            </Button>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {products.map((product) => (
                <div
                  key={product._id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    background: 'white',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                  onClick={() => navigate(`/vendor/products/${product._id}`)}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    background: '#f7fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {product.productImages && product.productImages.length > 0 ? (
                      <img
                        src={product.productImages[0].uri || product.productImages[0]}
                        alt={product.productName}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : (
                      <div style={{ color: '#a0aec0', fontSize: '3rem' }}>📦</div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{
                      margin: '0 0 0.5rem 0',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      color: '#2d3748'
                    }}>
                      {product.productName}
                    </h3>
                    <p style={{
                      margin: '0 0 0.5rem 0',
                      color: '#718096',
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {product.category}
                      {product.subcategory && ` • ${product.subcategory}`}
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        color: '#667eea'
                      }}>
                        ₹{product.price}
                      </span>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: product.status === 'in_stock' ? '#c6f6d5' : 
                                   product.status === 'low_stock' ? '#feebc8' : '#fed7d7',
                        color: product.status === 'in_stock' ? '#22543d' :
                               product.status === 'low_stock' ? '#7c2d12' : '#742a2a'
                      }}>
                        {product.status === 'in_stock' ? 'In Stock' :
                         product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <p style={{
                      margin: '0 0 1rem 0',
                      color: '#4a5568',
                      fontSize: '0.9rem'
                    }}>
                      Quantity: {product.quantity}
                    </p>
                    <div style={{
                      display: 'flex',
                      gap: '0.5rem'
                    }}>
                      <Button
                        variant="primary"
                        style={{ flex: 1, padding: '0.5rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/vendor/products/${product._id}`);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        style={{ padding: '0.5rem 1rem' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(product._id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pageCount > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '2rem'
              }}>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.prev || 1)}
                  disabled={!pagination.prev}
                >
                  Previous
                </Button>
                <span style={{
                  padding: '0.5rem 1rem',
                  background: '#f7fafc',
                  borderRadius: '6px'
                }}>
                  Page {pagination.currentPage} of {pagination.pageCount}
                </span>
                <Button
                  variant="secondary"
                  onClick={() => handlePageChange(pagination.next || pagination.pageCount)}
                  disabled={!pagination.next}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ProductList;

