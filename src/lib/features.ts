import { useEffect, useState } from 'react'

export interface FeatureItem {
  id: string
  title: string
  sub: string
  img: string
  span: string
  createdAt: number
}

const STORAGE_KEY = 'arcshield_features_v1'

const SEED: FeatureItem[] = [
  {
    id: 'feat-1',
    title: 'Military-Grade Drop Protection',
    sub: 'MIL-STD-810H certified. 16ft drop tested.',
    img: 'https://placehold.co/1200x900/0a0a0a/1a1a1a?text=Drop+Test',
    span: 'md:col-span-2 md:row-span-2',
    createdAt: 0,
  },
  {
    id: 'feat-2',
    title: 'MagSafe Compatible',
    sub: 'Perfectly aligned magnet array.',
    img: 'https://placehold.co/800x800/111111/2a2a2a?text=MagSafe',
    span: 'md:col-span-1',
    createdAt: 0,
  },
  {
    id: 'feat-3',
    title: 'Ultra-Thin Profile',
    sub: 'Just 1.8mm thin.',
    img: 'https://placehold.co/800x800/0d0d0d/222222?text=Profile',
    span: 'md:col-span-1',
    createdAt: 0,
  },
  {
    id: 'feat-4',
    title: 'Precision Cutouts',
    sub: 'Tactile metal buttons.',
    img: 'https://placehold.co/1200x600/111111/2a2a2a?text=Buttons',
    span: 'md:col-span-2',
    createdAt: 0,
  },
]

const read = (): FeatureItem[] => {
  if (typeof window === 'undefined') return SEED
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return SEED
    const parsed = JSON.parse(raw) as FeatureItem[]
    return Array.isArray(parsed) && parsed.length ? parsed : SEED
  } catch {
    return SEED
  }
}

const write = (features: FeatureItem[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(features))
  window.dispatchEvent(new Event('features:updated'))
}

export const addFeature = (input: Omit<FeatureItem, 'id' | 'createdAt'>): FeatureItem => {
  const feature: FeatureItem = {
    ...input,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  }
  const next = [...read(), feature]
  write(next)
  return feature
}

export const removeFeature = (id: string) => {
  write(read().filter((f) => f.id !== id))
}

export const useFeatures = (): FeatureItem[] => {
  const [features, setFeatures] = useState<FeatureItem[]>(() => read())

  useEffect(() => {
    const sync = () => setFeatures(read())
    window.addEventListener('features:updated', sync)
    window.addEventListener('storage', sync)

    return () => {
      window.removeEventListener('features:updated', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return features
}
