import { useSafeTransform } from '@/lib/motion'
import { useProducts } from '@/lib/products'
import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'

const features = [
  {
    title: 'Aerospace-grade polymer',
    body: 'A precision-machined shell forged from a unibody composite. Lighter than aluminum, stronger than steel — molded to fit the iPhone 17 Pro Max with sub-millimeter tolerances.',
  },
  {
    title: 'Camera bump fortress',
    body: 'A raised lip of reinforced ceramic surrounds the camera array. Lay it face-down without a second thought — your lenses never touch the surface.',
  },
  {
    title: 'Tactile, never slippery',
    body: 'A soft-touch microfinish provides confident grip without attracting fingerprints. The kind of feel you notice the first time, then forget forever.',
  },
]

export const StickyShowcase = () => {
  const ref = useRef<HTMLDivElement>(null)
  const products = useProducts()
  const frontImg = products[0]?.image ?? 'https://placehold.co/800x1000/0a0a0a/1a1a1a?text=Front'
  const backImg =
    products[1]?.image ??
    products[0]?.image ??
    'https://placehold.co/800x1000/111111/2a2a2a?text=Back'

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  const rotateY = useSafeTransform(scrollYProgress, [0, 1], [0, 180])
  const scale = useSafeTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])

  return (
    <section id="design" ref={ref} className="relative bg-background">
      <div className="relative" style={{ height: `${features.length * 90}vh` }}>
        <div className="sticky top-0 h-screen flex items-center">
          <div className="container grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
            {/* Sticky image */}
            <div className="relative h-[55vh] md:h-[75vh] flex items-center justify-center order-1 md:order-1">
              {/* h-full and w-fit ensures the bounding box perfectly wraps the image with NO empty gaps */}
              <div className="relative h-full w-fit" style={{ perspective: '1200px' }}>
                <motion.div
                  style={{ rotateY, scale, transformStyle: 'preserve-3d' }}
                  className="relative h-full w-full">
                  <motion.img
                    src={frontImg}
                    alt="Phone case front"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      // drop-shadow wraps the shape itself, ignoring the rectangular bounding box
                      filter: 'drop-shadow(0 30px 60px rgba(0, 150, 255, 0.35))',
                    }}
                    className="h-full w-auto object-contain rounded-[2.5rem] md:rounded-[3rem]"
                  />
                  <motion.img
                    src={backImg}
                    alt="Phone case back"
                    style={{
                      rotateY: 180,
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      filter: 'drop-shadow(0 30px 60px rgba(0, 150, 255, 0.35))',
                    }}
                    className="absolute top-0 left-0 h-full w-auto object-contain rounded-[2.5rem] md:rounded-[3rem]"
                  />
                </motion.div>
              </div>
            </div>

            {/* Scrolling text content */}
            <div className="hidden md:block order-2">
              <div className="space-y-6">
                {features.map((f, i) => {
                  const start = i / features.length
                  const end = (i + 1) / features.length
                  return (
                    <FeatureBlock
                      key={i}
                      feature={f}
                      start={start}
                      end={end}
                      progress={scrollYProgress}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile fallback text */}
      <div className="md:hidden container py-12 space-y-10">
        {features.map((f, i) => (
          <div key={i}>
            <h3 className="text-2xl font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-3 text-muted-foreground">{f.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const FeatureBlock = ({
  feature,
  start,
  end,
  progress,
}: {
  feature: { title: string; body: string }
  start: number
  end: number
  progress: any
}) => {
  const opacity = useSafeTransform(
    progress,
    [start - 0.05, start + 0.05, end - 0.05, end + 0.05],
    [0.2, 1, 1, 0.2]
  )
  const y = useSafeTransform(progress, [start, end], [20, -20])
  return (
    <motion.div style={{ opacity, y }} className="border-l-2 border-brand pl-6">
      <h3 className="text-3xl lg:text-4xl font-semibold tracking-tight text-gradient">
        {feature.title}
      </h3>
      <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{feature.body}</p>
    </motion.div>
  )
}
