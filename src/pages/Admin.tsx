import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { addFeature, removeFeature, useFeatures } from '@/lib/features'
import { addProduct, removeProduct, useProducts } from '@/lib/products'
import { clearShowcaseVideo, setShowcaseVideo, useShowcaseVideo } from '@/lib/showcaseVideo'
import { Trash2, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const productSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(120),
  price: z.coerce.number().positive('Price must be positive').max(100000),
  image: z
    .string()
    .trim()
    .min(1, 'Image URL is required')
    .max(2000)
    .refine(
      (v) => /^https?:\/\//i.test(v) || /^data:image\//i.test(v),
      'Must be a valid http(s) or data:image URL'
    ),
})

const featureSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(120),
  sub: z.string().trim().min(2, 'Subtitle must be at least 2 characters').max(200),
  img: z
    .string()
    .trim()
    .min(1, 'Image URL is required')
    .max(2000)
    .refine(
      (v) => /^https?:\/\//i.test(v) || /^data:image\//i.test(v),
      'Must be a valid http(s) or data:image URL'
    ),
  span: z.string().trim(),
})

const Admin = () => {
  const products = useProducts()
  const features = useFeatures()

  const [form, setForm] = useState({ name: '', price: '', image: '' })
  const [featureForm, setFeatureForm] = useState({
    title: '',
    sub: '',
    img: '',
    span: 'md:col-span-1',
  })

  const [preview, setPreview] = useState('')
  const [featurePreview, setFeaturePreview] = useState('')

  const currentVideo = useShowcaseVideo()
  const [videoUrl, setVideoUrlInput] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const saveVideoUrl = () => {
    const url = videoUrl.trim()
    if (!/^https?:\/\//i.test(url)) {
      toast({
        title: 'Invalid URL',
        description: 'Must start with http(s)://',
        variant: 'destructive',
      })
      return
    }
    setShowcaseVideo(url)
    setVideoUrlInput('')
    toast({ title: 'Video updated' })
  }

  const handleVideoFile = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Not a video',
        description: 'Please choose an MP4 file',
        variant: 'destructive',
      })
      return
    }
    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Browser storage limits files to ~4MB. Use a hosted URL instead.',
        variant: 'destructive',
      })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      try {
        setShowcaseVideo(String(reader.result))
        toast({ title: 'Video uploaded' })
      } catch {
        toast({
          title: 'Storage full',
          description: 'Use a hosted URL instead.',
          variant: 'destructive',
        })
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const result = productSchema.safeParse(form)
    if (!result.success) {
      toast({
        title: 'Invalid product',
        description: result.error.issues[0].message,
        variant: 'destructive',
      })
      return
    }
    addProduct({
      name: result.data.name,
      price: result.data.price,
      image: result.data.image,
    })
    toast({ title: 'Product added', description: result.data.name })
    setForm({ name: '', price: '', image: '' })
    setPreview('')
  }

  const handleSubmitFeature = (e: React.FormEvent) => {
    e.preventDefault()
    const result = featureSchema.safeParse(featureForm)
    if (!result.success) {
      toast({
        title: 'Invalid feature',
        description: result.error.issues[0].message,
        variant: 'destructive',
      })
      return
    }
    addFeature({
      title: result.data.title,
      sub: result.data.sub,
      img: result.data.img,
      span: result.data.span,
    })
    toast({ title: 'Feature added', description: result.data.title })
    setFeatureForm({ title: '', sub: '', img: '', span: 'md:col-span-1' })
    setFeaturePreview('')
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="border-b hairline">
        <div className="container h-14 flex items-center justify-between">
          <h1 className="text-sm font-semibold tracking-tight">
            ARCSHIELD<span className="text-brand">.</span> Admin
          </h1>
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to store
          </Link>
        </div>
      </header>

      <main className="container py-12 grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl">
        {/* ADD PRODUCT FORM */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Add product</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste an image URL. Products are saved to this browser's local storage.
          </p>

          <form onSubmit={handleSubmitProduct} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="iPhone 17 Pro Max Case — Forest Green"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="59"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                type="url"
                value={form.image}
                onChange={(e) => {
                  setForm({ ...form, image: e.target.value })
                  setPreview(e.target.value)
                }}
                placeholder="https://example.com/case.jpg"
                required
              />
            </div>

            {preview && (
              <div className="rounded-2xl overflow-hidden border hairline aspect-square max-w-xs bg-surface-elevated">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setPreview('')}
                />
              </div>
            )}

            <Button
              type="submit"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-11 px-6">
              Add product
            </Button>
          </form>
        </section>

        {/* PRODUCTS LIST */}
        <section>
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Products</h2>
            <span className="text-sm text-muted-foreground">{products.length} total</span>
          </div>

          <ul className="mt-6 space-y-3">
            {products.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 p-3 rounded-2xl border hairline bg-surface">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-14 h-14 rounded-xl object-cover bg-surface-elevated"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">${p.price.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    removeProduct(p.id)
                    toast({ title: 'Removed', description: p.name })
                  }}
                  className="w-9 h-9 rounded-full hover:bg-surface-elevated flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {products.length === 0 && (
              <li className="text-sm text-muted-foreground py-8 text-center border hairline rounded-2xl">
                No products yet.
              </li>
            )}
          </ul>
        </section>

        {/* SHOWCASE VIDEO */}
        <section className="lg:col-span-2 border-t hairline pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Showcase video</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste an MP4 URL (recommended) or upload a small file. Used in the "See it survive"
            section.
          </p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="vurl">Video URL (.mp4)</Label>
              <div className="flex gap-2">
                <Input
                  id="vurl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  placeholder="https://example.com/showcase.mp4"
                />
                <Button
                  type="button"
                  onClick={saveVideoUrl}
                  className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                  Save
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground py-2">— or —</div>

              <input
                ref={fileRef}
                type="file"
                accept="video/mp4,video/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleVideoFile(f)
                  if (fileRef.current) fileRef.current.value = ''
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileRef.current?.click()}
                className="w-full rounded-full h-11 gap-2">
                <Upload className="w-4 h-4" /> Upload .mp4 (max 4MB)
              </Button>

              {currentVideo && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    clearShowcaseVideo()
                    toast({ title: 'Video removed' })
                  }}
                  className="w-full text-destructive hover:text-destructive">
                  Remove current video
                </Button>
              )}
            </div>

            <div className="rounded-2xl overflow-hidden border hairline aspect-video bg-surface-elevated">
              {currentVideo ? (
                <video
                  src={currentVideo}
                  controls
                  className="w-full h-full object-cover bg-black"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
                  No video set
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ADD FEATURE FORM */}
        <section className="border-t hairline pt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Add grid feature</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add images and text to the "Every angle, considered" section.
          </p>

          <form onSubmit={handleSubmitFeature} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="f-title">Title</Label>
              <Input
                id="f-title"
                value={featureForm.title}
                onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                placeholder="Military-Grade Drop Protection"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-sub">Subtitle</Label>
              <Input
                id="f-sub"
                value={featureForm.sub}
                onChange={(e) => setFeatureForm({ ...featureForm, sub: e.target.value })}
                placeholder="MIL-STD-810H certified. 16ft drop tested."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-img">Image URL</Label>
              <Input
                id="f-img"
                type="url"
                value={featureForm.img}
                onChange={(e) => {
                  setFeatureForm({ ...featureForm, img: e.target.value })
                  setFeaturePreview(e.target.value)
                }}
                placeholder="https://example.com/feature.jpg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="f-span">Grid Size</Label>
              <div className="flex h-11 w-full rounded-md border border-input bg-background overflow-hidden px-1">
                <select
                  id="f-span"
                  value={featureForm.span}
                  onChange={(e) => setFeatureForm({ ...featureForm, span: e.target.value })}
                  className="w-full bg-transparent outline-none text-sm px-2">
                  <option value="md:col-span-1">Standard Square (1x1)</option>
                  <option value="md:col-span-2">Wide Rectangle (2x1)</option>
                  <option value="md:col-span-2 md:row-span-2">Large Square (2x2)</option>
                </select>
              </div>
            </div>

            {featurePreview && (
              <div className="rounded-2xl overflow-hidden border hairline aspect-video max-w-xs bg-surface-elevated">
                <img
                  src={featurePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={() => setFeaturePreview('')}
                />
              </div>
            )}

            <Button
              type="submit"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 h-11 px-6">
              Add feature
            </Button>
          </form>
        </section>

        {/* FEATURES LIST */}
        <section className="border-t hairline lg:border-t-0 pt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
            <span className="text-sm text-muted-foreground">{features.length} total</span>
          </div>

          <ul className="mt-6 space-y-3">
            {features.map((f) => (
              <li
                key={f.id}
                className="flex items-center gap-4 p-3 rounded-2xl border hairline bg-surface">
                <img
                  src={f.img}
                  alt={f.title}
                  className="w-14 h-14 rounded-xl object-cover bg-surface-elevated"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{f.sub}</p>
                </div>
                <button
                  onClick={() => {
                    removeFeature(f.id)
                    toast({ title: 'Removed', description: f.title })
                  }}
                  className="w-9 h-9 rounded-full hover:bg-surface-elevated flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                  aria-label="Remove">
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {features.length === 0 && (
              <li className="text-sm text-muted-foreground py-8 text-center border hairline rounded-2xl">
                No features yet.
              </li>
            )}
          </ul>
        </section>
      </main>
    </div>
  )
}

export default Admin
