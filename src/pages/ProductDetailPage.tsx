import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ArrowLeft, Pencil, Star, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '@/types/product';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const getProduct = useProductStore((s) => s.getProduct);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const result = await getProduct(Number(id));
                setProduct(result);
            } catch {
                toast.error('Failed to load product');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, getProduct]);

    if (loading) return <LoadingSpinner />;

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <p className="text-sm font-medium text-gray-900">
                    Product not found
                </p>
                <Link
                    to="/products"
                    className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                >
                    Back to Products
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl">
            <div className="flex items-center justify-between mb-6">
                <Link
                    to="/products"
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Products
                </Link>

                <Link
                    to={`/products/${product.id}/edit`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 p-6 bg-gray-50/50">
                        {product.images.length > 0 ? (
                            <div className="space-y-3">
                                <img
                                    src={product.images[0]}
                                    alt={product.title}
                                    className="w-full max-h-80 object-contain rounded-xl"
                                />

                                {product.images.length > 1 && (
                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                        {product.images.slice(1).map((img, i) => (
                                            <img
                                                key={i}
                                                src={img}
                                                alt={`${product.title} ${i + 2}`}
                                                className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0 hover:border-indigo-300 transition-colors"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                                <Package className="w-10 h-10 text-gray-300" />
                            </div>
                        )}
                    </div>

                    <div className="md:w-1/2 p-6">
                        <div className="mb-4">
                            <span className="inline-flex px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-500 rounded-md capitalize mb-2">
                                {product.category}
                            </span>

                            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                                {product.title}
                            </h1>

                            {product.brand && (
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {product.brand}
                                </p>
                            )}
                        </div>

                        <p className="text-sm text-gray-600 leading-relaxed mb-5">
                            {product.description}
                        </p>

                        <div className="flex items-baseline gap-2.5 mb-6">
                            <span className="text-2xl font-bold text-gray-900 tabular-nums">
                                ${product.price.toFixed(2)}
                            </span>

                            {product.discountPercentage > 0 && (
                                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    -{product.discountPercentage}%
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-[11px] text-gray-400 font-medium">
                                        Rating
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {product.rating}/5
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-[11px] text-gray-400 font-medium">
                                        Stock
                                    </p>
                                    <p className="text-sm font-semibold text-gray-900">
                                        {product.stock} units
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2.5 text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Shipping
                                    </p>
                                    <p className="text-gray-500">
                                        {product.shippingInformation}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Warranty
                                    </p>
                                    <p className="text-gray-500">
                                        {product.warrantyInformation}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 text-gray-600">
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Return Policy
                                    </p>
                                    <p className="text-gray-500">
                                        {product.returnPolicy}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {product.reviews.length > 0 && (
                    <div className="border-t border-gray-100 p-6">
                        <h2 className="text-sm font-semibold text-gray-900 mb-4">
                            Reviews ({product.reviews.length})
                        </h2>

                        <div className="space-y-3">
                            {product.reviews.map((review, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-gray-50 rounded-lg"
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-900">
                                            {review.reviewerName}
                                        </span>

                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: 5 }).map(
                                                (_, s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3 h-3 ${
                                                            s < review.rating
                                                                ? 'text-amber-400 fill-amber-400'
                                                                : 'text-gray-200'
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        {review.comment}
                                    </p>

                                    <p className="text-[11px] text-gray-400 mt-2">
                                        {new Date(
                                            review.date
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}