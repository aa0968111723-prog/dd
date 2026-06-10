import { useEffect, useState } from 'react'

export type Route = 'home' | 'catalog' | 'my-skates' | 'mileage' | 'accessories'

const VALID: Route[] = ['home', 'catalog', 'my-skates', 'mileage', 'accessories']

export function parseHash(): Route {
  const h = window.location.hash.replace(/^#\/?/, '').split('?')[0]
  return (VALID as string[]).includes(h) ? (h as Route) : 'home'
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash)
  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export function navigate(route: Route) {
  window.location.hash = '/' + route
}
