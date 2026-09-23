import { lazy, Suspense, useSyncExternalStore, type ComponentType } from 'react'
import type { GradientMeshProps } from '@/components/ui/gradient-mesh'

/* A chunk that fails to load (a network drop, or a page left open across a
   deploy, whose hashed file is gone) leaves the still strip, as no WebGL
   does; unhandled, the rejection would take the whole page down with it. */
const GradientMesh = lazy<ComponentType<GradientMeshProps>>(() =>
  import('@/components/ui/gradient-mesh').then(
    (m) => ({ default: m.GradientMesh }),
    () => ({ default: () => null }),
  ),
)

/* The Ember strip from the identity pack, pink through coral into peach,
   rendered by a shader that warps the gradient with slow noise so the colour
   itself rolls and folds. The still CSS strip underneath is the no-WebGL
   case. In dark mode the band is smoked, an ink wash over the mesh, so it
   sits with the dark page; copy on it stays paper, the only ink that reads
   on the band. The hero and the close stand on the same band, and fold at
   the same size: the noise is scaled from the longer side, at the density
   the short close band had when Taylor asked for the hero to match it, and
   the warp a shade under that ("slightly less obvious", 22 Sep). */
const BAND = 'linear-gradient(100deg, #e8437e 0%, #ff5c6c 50%, #ff9b7a 100%)'
/* Module-level so the shader builds once. */
const MESH_COLOURS = ['#E8437E', '#FF5C6C', '#FF7A5C', '#FF9B7A']

/* The shader is the browser's alone. The build renders the still strip, and
   the mesh joins once the page has hydrated: false while the browser takes
   over the build's markup, true from the render after. */
const neverChanges = () => () => {}
function useHydrated() {
  return useSyncExternalStore(neverChanges, () => true, () => false)
}

export function Band() {
  const hydrated = useHydrated()
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={{ background: BAND }} />
      {hydrated && (
        <Suspense fallback={null}>
          <GradientMesh className="absolute inset-0" colours={MESH_COLOURS} angle={100} warp={0.25} scale={4.7} speed={1} />
        </Suspense>
      )}
      <div className="absolute inset-0 hidden bg-ink/55 dark:block" />
    </div>
  )
}
