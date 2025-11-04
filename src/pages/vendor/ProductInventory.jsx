import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import { api } from '../../config/api';
import { isAuthenticated } from '../../utils/auth';

const ProductInventory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState({ categories: {}, subcategories: {} });
  const [formData, setFormData] = useState({
    productName: '',
    productDescription: '',
    quantity: 0,
    price: '',
    category: '',
    subcategory: '',
    status: 'in_stock',
    storeId: '',
  });
  const [productImages, setProductImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/vendor/login');
      return;
    }

    // Load categories
    api.products.getCategories()
      .then(res => {
        if (res.data.code === 'SUCCESS') {
          setCategories(res.data.data);
        }
      })
      .catch(err => console.error('Error loading categories:', err));

    // If editing, load product data
    if (id) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const loadProduct = async () => {
    try {
      const res = await api.products.getById(id);
      if (res.data.code === 'SUCCESS') {
        const product = res.data.data;
        setFormData({
          productName: product.productName || '',
          productDescription: product.productDescription || '',
          quantity: product.quantity || 0,
          price: product.price || '',
          category: product.category || '',
          subcategory: product.subcategory || '',
          status: product.status || 'in_stock',
          storeId: product.storeId?._id || product.storeId || '',
        });
        if (product.productImages && product.productImages.length > 0) {
          setExistingImages(product.productImages);
        }
      }
    } catch (err) {
      console.error('Error loading product:', err);
      alert('Failed to load product');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productImages.length > 4) {
      alert('Maximum 4 images allowed');
      return;
    }

    const newImages = [...productImages, ...files];
    setProductImages(newImages);

    // Create previews
    const newPreviews = newImages.map(file => URL.createObjectURL(file));
    setImagePreviews(newPreviews);
  };


  const adjustQuantity = (delta) => {
    setFormData(prev => ({
      ...prev,
      quantity: Math.max(0, prev.quantity + delta)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('productName', formData.productName);
      submitData.append('productDescription', formData.productDescription);
      submitData.append('quantity', formData.quantity);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      if (formData.subcategory) {
        submitData.append('subcategory', formData.subcategory);
      }
      submitData.append('status', formData.status);
      submitData.append('storeId', formData.storeId);

      // Append images
      productImages.forEach((file) => {
        submitData.append('productImages', file);
      });

      let res;
      if (id) {
        res = await api.products.update(id, submitData);
      } else {
        res = await api.products.create(submitData);
      }

      if (res.data.code === 'SUCCESS') {
        alert(id ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/vendor/products');
      } else {
        alert(res.data.message || 'Operation failed');
      }
    } catch (err) {
      console.error('Error:', err);
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await api.products.delete(id);
      if (res.data.code === 'SUCCESS') {
        alert('Product deleted successfully!');
        navigate('/vendor/products');
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
    { value: 'in_stock', label: 'In Stock' },
    { value: 'out_of_stock', label: 'Out of Stock' },
    { value: 'low_stock', label: 'Low Stock' },
  ];

  // Helper to get image URL
  const getImageUrl = (image) => {
    if (typeof image === 'string') return image;
    if (image.uri) {
      // If it's a relative path, prepend the base URL
      return image.uri.startsWith('http') ? image.uri : `${window.location.origin}${image.uri}`;
    }
    return null;
  };

  // Combine existing images with previews
  const allImages = [
    ...existingImages.map(img => ({ type: 'existing', data: img })),
    ...imagePreviews.map(img => ({ type: 'preview', data: img }))
  ];

  return (
    <Layout>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ←
          </button>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>
            Inventory Management
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Product Name"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
          />

          <Select
            label="Product Status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            options={statusOptions}
            required
          />

          {/* Product Images */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Product Images
            </label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {/* Main large image */}
              <div style={{
                aspectRatio: '1',
                border: '2px dashed #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                background: '#f7fafc',
                cursor: 'pointer'
              }}>
                {allImages[0] ? (
                  <img
                    src={allImages[0].type === 'preview' ? allImages[0].data : getImageUrl(allImages[0].data)}
                    alt="Product"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                ) : (
                  <div style={{ textAlign: 'center', color: '#a0aec0' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                    <div style={{ fontSize: '0.8rem' }}>Add Image</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0,
                    cursor: 'pointer'
                  }}
                  multiple
                />
              </div>

              {/* Two smaller images */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[1, 2].map(imgIndex => (
                  <div
                    key={imgIndex}
                    style={{
                      aspectRatio: '1',
                      border: '2px dashed #e2e8f0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      background: '#f7fafc',
                      cursor: 'pointer'
                    }}
                  >
                    {allImages[imgIndex] ? (
                      <img
                        src={allImages[imgIndex].type === 'preview' ? allImages[imgIndex].data : getImageUrl(allImages[imgIndex].data)}
                        alt="Product"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#a0aec0', fontSize: '1.5rem' }}>
                        +
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                      }}
                      multiple
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Product Description
            </label>
            <textarea
              name="productDescription"
              value={formData.productDescription}
              onChange={handleInputChange}
              placeholder="Add Here"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '1rem',
                minHeight: '120px',
                fontFamily: 'inherit',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#2d3748',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Adjust Product Quantity
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.5rem',
              width: 'fit-content'
            }}>
              <button
                type="button"
                onClick={() => adjustQuantity(-1)}
                style={{
                  background: '#fc8181',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                -
              </button>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                min="0"
                style={{
                  width: '80px',
                  textAlign: 'center',
                  border: 'none',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  outline: 'none'
                }}
              />
              <button
                type="button"
                onClick={() => adjustQuantity(1)}
                style={{
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  width: '40px',
                  height: '40px',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                +
              </button>
            </div>
          </div>

          <Input
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            required
            placeholder="0.00"
            step="0.01"
            min="0"
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            options={categoryOptions}
            required
          />

          <Select
            label="Subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleInputChange}
            options={subcategoryOptions}
          />

          <Input
            label="Store ID"
            name="storeId"
            value={formData.storeId}
            onChange={handleInputChange}
            required
            placeholder="Enter Store ID"
          />

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <Button
              type="submit"
              variant="success"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Processing...' : (id ? 'Update Product' : 'Create Product')}
            </Button>
            {id && (
              <Button
                type="button"
                variant="danger"
                onClick={handleDelete}
                disabled={loading}
              >
                Delete Product
              </Button>
            )}
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ProductInventory;

