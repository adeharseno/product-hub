import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProductStore } from '@/stores/productStore';
import TableSkeleton from '@/components/TableSkeleton';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import ConfirmDialog from '@/components/ConfirmDialog';
import { Plus, Eye, Pencil, Trash2, PackageOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product } from '@/types/product';

const LIMIT = 10;

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [deleting, setDeleting] = useState(false);

    const { fetchProducts, deleteProduct } = useProductStore();

    const loadProducts = useCallback(async () => {
        setLoading(true);

        try {
            const skip = (page - 1) * LIMIT;

            const res = await fetchProducts({
                search: search || undefined,
                limit: LIMIT,
                skip,
            });

            setProducts(res.products);
            setTotal(res.total);
        } catch {
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [page, search, fetchProducts]);

    useEffect(() => {
        loadProducts();
    }, [loadProducts]);

    const handleSearch = useCallback((value: string) => {
        setSearch(value);
        setPage(1);
    }, []);

    const handleDelete = async () => {
        if (!deleteTarget) return;

        setDeleting(true);

        try {
            await deleteProduct(deleteTarget.id);
            toast.success('Product deleted');
            setDeleteTarget(null);

            const newTotal = total - 1;
            const maxPage = Math.max(1, Math.ceil(newTotal / LIMIT));

            if (page > maxPage) {
                setPage(maxPage);
            } else {
                const skip = (page - 1) * LIMIT;

                const res = await fetchProducts({
                    search: search || undefined,
                    limit: LIMIT,
                    skip,
                });

                setProducts(res.products);
                setTotal(res.total);
            }
        } catch {
            toast.error('Failed to delete product');
        } finally {
            setDeleting(false);
        }
    };

    const totalPages = Math.ceil(total / LIMIT);

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                        Products
                    </h1>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <SearchInput
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search products..."
                    />

                    <Link
                        to="/products/add"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {loading ? (
                <TableSkeleton rows={6} />
            ) : products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200/80">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <PackageOpen className="w-6 h-6 text-gray-400" />
                    </div>

                    <p className="text-sm font-medium text-gray-900">
                        No products found
                    </p>

                    <p className="text-xs text-gray-500 mt-1 mb-4">
                        Try adjusting your search or add a new product.
                    </p>

                    <Link
                        to="/products/add"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Add Product
                    </Link>
                </div>
            ) : (
                <>
                    <div className="hidden md:block bg-white rounded-xl border border-gray-200/80 overflow-hidden">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Product
                                    </th>
                                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Category
                                    </th>
                                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Price
                                    </th>
                                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Stock
                                    </th>
                                    <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {products.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="border-b border-gray-50 last:border-b-0/50 transition-colors"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={product.thumbnail}
                                                    alt={product.title}
                                                    className="w-24 h-24 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                                />
                                                <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                    {product.title}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-md capitalize">
                                                {product.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-3.5 text-sm text-gray-900 text-right font-medium tabular-nums">
                                            ${product.price.toFixed(2)}
                                        </td>

                                        <td className="px-5 py-3.5 text-sm text-gray-500 text-right tabular-nums">
                                            {product.stock}
                                        </td>

                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="p-1.5 rounded-lg text-gray-400 transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>

                                                <Link
                                                    to={`/products/${product.id}/edit`}
                                                    className="p-1.5 rounded-lg text-gray-400 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>

                                                <button
                                                    onClick={() => setDeleteTarget(product)}
                                                    className="p-1.5 rounded-lg text-gray-400 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden space-y-3">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl border border-gray-200/80 p-4"
                            >
                                <div className="flex gap-3">
                                    <img
                                        src={product.thumbnail}
                                        alt={product.title}
                                        className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                                    />

                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-medium text-gray-900 truncate">
                                            {product.title}
                                        </h3>

                                        <span className="inline-flex mt-1 px-2 py-0.5 text-[11px] font-medium bg-gray-100 text-gray-500 rounded-md capitalize">
                                            {product.category}
                                        </span>

                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-sm font-semibold text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Stock: {product.stock}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-100">
                                    <Link
                                        to={`/products/${product.id}`}
                                        className="p-1.5 rounded-lg text-gray-400 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>

                                    <Link
                                        to={`/products/${product.id}/edit`}
                                        className="p-1.5 rounded-lg text-gray-400 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>

                                    <button
                                        onClick={() => setDeleteTarget(product)}
                                        className="p-1.5 rounded-lg text-gray-400 transition-colors cursor-pointer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            <ConfirmDialog
                isOpen={!!deleteTarget}
                title="Delete Product"
                message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={deleting}
            />
        </div>
    );
}