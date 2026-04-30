import { useShowcaseVideo } from '@/lib/showcaseVideo'
import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'

export const VideoShowcase = () => {
  const [playing, setPlaying] = useState(false)
  const videoUrl = useShowcaseVideo()
  const placeholderPoster = 'https://placehold.co/1920x1080/0a0a0a/1a1a1a?text=Showcase+Video'

  return (
    <section id="showcase" className="py-24 md:py-32 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-brand">In Action</span>
          <h2 className="mt-3 text-4xl md:text-6xl font-semibold tracking-tight text-gradient">
            See it survive.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Drop tested from 10 feet. Frozen. Submerged. Run over. The case keeps going.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-video rounded-3xl overflow-hidden shadow-card hairline border bg-black">
          {playing && videoUrl ? (
            <video autoPlay controls playsInline className="w-full h-full object-cover bg-black">
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            <button
              onClick={() => videoUrl && setPlaying(true)}
              className="group relative w-full h-full block"
              aria-label="Play video"
              disabled={!videoUrl}>
              {videoUrl ? (
                <video src={videoUrl} preload="metadata" className="w-full h-full object-cover" />
              ) : (
                <img
                  src={placeholderPoster}
                  alt="Video poster"
                  className="w-full h-full object-cover"
                />
              )}

              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full glass border hairline flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                  <Play className="w-8 h-8 md:w-10 md:h-10 text-foreground fill-foreground ml-1" />
                </div>
              </div>
              {!videoUrl && (
                <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
                  No showcase video yet — add one in /admin
                </div>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
