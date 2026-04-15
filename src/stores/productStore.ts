import { create } from 'zustand';
import api from '@/lib/axios';
import type { Product, ProductFormData, ProductsResponse } from '@/types/product';

type ProductStore = {
    added: Product[];
    deleted: number[];
    edited: Record<number, Product>;

    fetchProducts: (params: { search?: string; limit: number; skip: number }) => Promise<{ products: Product[]; total: number }>;
    getProduct: (id: number) => Promise<Product | null>;
    addProduct: (data: ProductFormData) => Promise<Product>;
    updateProduct: (id: number, data: ProductFormData) => Promise<Product>;
    deleteProduct: (id: number) => Promise<void>;
};

let _nextId = 1000;

export const useProductStore = create<ProductStore>()((set, get) => ({
    added: [],
    deleted: [],
    edited: {},

    fetchProducts: async ({ search, limit, skip }) => {
        const { added, deleted, edited } = get();

        const localMatches = search
            ? added.filter(p => {
                const q = search.toLowerCase();
                return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
                })
            : added;

        const url = search
            ? `/products/search?q=${encodeURIComponent(search)}&limit=${limit + deleted.length}&skip=${skip}`
            : `/products?limit=${limit + deleted.length}&skip=${skip}`;

        const { data } = await api.get<ProductsResponse>(url);

        const apiItems = data.products
            .filter(p => !deleted.includes(p.id))
            .map(p => edited[p.id] ? { ...p, ...edited[p.id] } : p)
            .slice(0, limit);

        const products = skip === 0
            ? [...localMatches, ...apiItems].slice(0, limit)
            : apiItems;

        const total = data.total - deleted.length + localMatches.length;
        return { products, total };
    },

    getProduct: async (id) => {
        const { added, edited, deleted } = get();
        if (deleted.includes(id)) return null;

        const local = added.find(p => p.id === id);
        if (local) return local;

        try {
            const { data } = await api.get<Product>(`/products/${id}`);
            return edited[id] ? { ...data, ...edited[id] } : data;
        } catch {
            return null;
        }
    },

    addProduct: async (formData) => {
        const { data } = await api.post<Product>('/products/add', formData);

        const product: Product = {
            ...data,
            id: ++_nextId,
            price: Number(formData.price),
            stock: Number(formData.stock),
            thumbnail: formData.thumbnail || '',
            images: formData.thumbnail ? [formData.thumbnail] : [],
            rating: 0,
            discountPercentage: 0,
            reviews: [],
            tags: [],
            brand: String(formData.brand || ''),
            availabilityStatus: 'In Stock',
            sku: '',
            weight: 0,
            dimensions: { width: 0, height: 0, depth: 0 },
            warrantyInformation: '',
            shippingInformation: '',
            returnPolicy: '',
            minimumOrderQuantity: 1,
            meta: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                barcode: '',
                qrCode: '',
            },
        };

        set(s => ({ added: [product, ...s.added] }));
        return product;
    },

    updateProduct: async (id, formData) => {
        const { added } = get();
        const isLocal = added.some(p => p.id === id);

        if (isLocal) {
            const existing = added.find(p => p.id === id)!;
            const updated = { ...existing, ...formData, price: Number(formData.price), stock: Number(formData.stock) } as Product;
            set(s => ({ added: s.added.map(p => p.id === id ? updated : p) }));
            return updated;
        }

        const { data } = await api.put<Product>(`/products/${id}`, formData);
        const updated = { ...data, id, price: Number(formData.price), stock: Number(formData.stock) };
        set(s => ({ edited: { ...s.edited, [id]: updated } }));
        return updated;
    },

    deleteProduct: async (id) => {
        const { added } = get();

        if (added.some(p => p.id === id)) {
            set(s => ({ added: s.added.filter(p => p.id !== id) }));
            return;
        }

        await api.delete(`/products/${id}`);
        set(s => ({
            deleted: [...s.deleted, id],
            edited: Object.fromEntries(Object.entries(s.edited).filter(([k]) => +k !== id)),
        }));
    },
}));
