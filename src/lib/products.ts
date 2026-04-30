import { useEffect, useState } from 'react'

export interface Product {
  id: string
  name: string
  price: number
  image: string
  createdAt: number
}

const STORAGE_KEY = 'arcshield_products_v1'

const SEED: Product[] = [
  {
    id: 'seed-1',
    name: 'iPhone 17 Pro Max Case — Midnight Black',
    price: 59,
    image: 'https://placehold.co/800x1000/0a0a0a/1a1a1a?text=Case+Black',
    createdAt: 0,
  },
  {
    id: 'seed-2',
    name: 'iPhone 17 Pro Max Case — Arctic White',
    price: 59,
    image: 'https://placehold.co/800x1000/f5f5f5/cccccc?text=Case+White',
    createdAt: 0,
  },
]

const read = (): Product[] => {
  if (typeof window === 'undefined') return SEED
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw) as Product[]
    return Array.isArray(parsed) && parsed.length ? parsed : SEED
  } catch {
    return SEED
  }
}

const write = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
  window.dispatchEvent(new Event('products:updated'))
}

export const addProduct = (input: Omit<Product, 'id' | 'createdAt'>): Product => {
  const product: Product = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  const next = [product, ...read()]
  write(next)
  return product
}

export const removeProduct = (id: string) => {
  write(read().filter((p) => p.id !== id))
}

export const useProducts = (): Product[] => {
  const [products, setProducts] = useState<Product[]>(() => read())
  useEffect(() => {
    const sync = () => setProducts(read())
    window.addEventListener('products:updated', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('products:updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return products
}
