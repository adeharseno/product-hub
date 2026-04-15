import { useState, useEffect, type FormEvent } from 'react';
import type { ProductFormData } from '@/types/product';
import api from '@/lib/axios';

type Props = {
    initialData?: ProductFormData;
    onSubmit: (data: ProductFormData) => Promise<void>;
    isSubmitting: boolean;
    submitLabel: string;
};

const fieldStyles = 'w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all placeholder:text-gray-400';

export default function ProductForm({ initialData, onSubmit, isSubmitting, submitLabel }: Props) {
    const [form, setForm] = useState<ProductFormData>({
        title: '',
        description: '',
        category: '',
        price: '',
        brand: '',
        stock: '',
        thumbnail: '',
    });
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        api.get<string[]>('/products/category-list').then((res) => {
            setCategories(res.data);
        });
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
        });
    };

    const handleChange = (field: keyof ProductFormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
            <div className="bg-white rounded-xl border border-gray-200/80 p-5 space-y-4">
                <div>
                    <label htmlFor="title" className="block text-xs font-medium text-gray-600 mb-1.5">Title</label>
                    <input id="title" type="text" value={form.title} onChange={e => handleChange('title', e.target.value)} className={fieldStyles} required />
                </div>

                <div>
                    <label htmlFor="description" className="block text-xs font-medium text-gray-600 mb-1.5">Description</label>
                    <textarea id="description" value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} className={fieldStyles + ' resize-none'} required />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="category" className="block text-xs font-medium text-gray-600 mb-1.5">Category</label>
                        <select id="category" value={form.category} onChange={e => handleChange('category', e.target.value)} className={fieldStyles} required>
                            <option value="">Select category</option>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="brand" className="block text-xs font-medium text-gray-600 mb-1.5">Brand</label>
                        <input id="brand" type="text" value={form.brand} onChange={e => handleChange('brand', e.target.value)} className={fieldStyles} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-xs font-medium text-gray-600 mb-1.5">Price ($)</label>
                        <input id="price" type="number" min="0" step="0.01" value={form.price} onChange={e => handleChange('price', e.target.value)} className={fieldStyles} required />
                    </div>
                    <div>
                        <label htmlFor="stock" className="block text-xs font-medium text-gray-600 mb-1.5">Stock</label>
                        <input id="stock" type="number" min="0" value={form.stock} onChange={e => handleChange('stock', e.target.value)} className={fieldStyles} required />
                    </div>
                </div>

                <div>
                    <label htmlFor="thumbnail" className="block text-xs font-medium text-gray-600 mb-1.5">Thumbnail URL</label>
                    <input id="thumbnail" type="url" value={form.thumbnail} onChange={e => handleChange('thumbnail', e.target.value)} className={fieldStyles} />
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
            >
                {isSubmitting ? 'Saving...' : submitLabel}
            </button>
        </form>
    );
}
