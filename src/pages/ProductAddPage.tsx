import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import ProductForm from '@/components/ProductForm';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ProductFormData } from '@/types/product';

export default function ProductAddPage() {
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const addProduct = useProductStore(s => s.addProduct);

    const handleSubmit = async (data: ProductFormData) => {
        setSubmitting(true);
        try {
            await addProduct(data);
            toast.success('Product created');
            navigate('/products');
        } catch {
            toast.error('Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl">
            <Link to="/products" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6">
                <ArrowLeft className="w-4 h-4" />
                Back to Products
            </Link>
            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Add New Product</h1>
            </div>
            <ProductForm onSubmit={handleSubmit} isSubmitting={submitting} submitLabel="Create Product" />
        </div>
    );
}
