import { lazy, Suspense } from 'react'

const GradientMesh = lazy(() =>
  import('@/components/ui/gradient-mesh').then((m) => ({ default: m.GradientMesh })),
)

/* The Ember strip from the identity pack, pink through coral into peach,
   rendered by a shader that warps the gradient with slow noise so the colour
   itself rolls and folds. The still CSS strip underneath is the no-WebGL
   case. In dark mode the band is smoked, an ink wash over the mesh, so it
   sits with the dark page; copy on it stays paper, the only ink that reads
   on the band. The hero and the close stand on the same band. */
const BAND = 'linear-gradient(100deg, #e8437e 0%, #ff5c6c 50%, #ff9b7a 100%)'
/* Module-level so the shader builds once. */
const MESH_COLOURS = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']

export function Band() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: BAND }} />
      <Suspense fallback={null}>
        <GradientMesh className="absolute inset-0" colours={MESH_COLOURS} angle={100} warp={0.3} scale={1.3} speed={1} />
      </Suspense>
      <div className="absolute inset-0 hidden bg-ink/55 dark:block" />
    </div>
  )
}
