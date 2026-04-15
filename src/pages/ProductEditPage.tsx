import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import ProductForm from '@/components/ProductForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import type { ProductFormData } from '@/types/product';

export default function ProductEditPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProduct, updateProduct } = useProductStore();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [initialData, setInitialData] = useState<ProductFormData | undefined>();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await getProduct(Number(id));

                if (product) {
                    setInitialData({
                        title: product.title,
                        description: product.description,
                        category: product.category,
                        price: product.price,
                        brand: product.brand || '',
                        stock: product.stock,
                        thumbnail: product.thumbnail,
                    });
                } else {
                    toast.error('Product not found');
                }
            } catch {
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, getProduct]);

    const handleSubmit = async (data: ProductFormData) => {
        setSubmitting(true);

        try {
            await updateProduct(Number(id), data);
            toast.success('Product updated');
            navigate(`/products/${id}`);
        } catch {
            toast.error('Failed to update product');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-2xl">
            <Link
                to={`/products/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Product
            </Link>

            <div className="mb-6">
                <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                    Edit Product
                </h1>
            </div>

            <ProductForm
                initialData={initialData}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
                submitLabel="Update Product"
            />
        </div>
    );
}