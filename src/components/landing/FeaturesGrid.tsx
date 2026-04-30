import { useFeatures } from '@/lib/features'
import { motion } from 'framer-motion'

export const FeaturesGrid = () => {
  const items = useFeatures()

  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-brand">Crafted in detail</span>
          <h2 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight text-gradient">
            Every angle, considered.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[280px]">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative rounded-3xl overflow-hidden hairline border bg-surface ${item.span}`}>
              <img
                src={item.img}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-lg md:text-xl font-semibold tracking-tight">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
