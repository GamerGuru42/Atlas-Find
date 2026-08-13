import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AtlasFind',
    short_name: 'AtlasFind',
    description: 'Find fully funded scholarships, internships, fellowships, and study abroad opportunities worldwide.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // You should eventually add proper 192x192 and 512x512 png icons in /public
    ],
  }
}
