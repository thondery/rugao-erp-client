import App from '../containers/app'
import { Routes } from '../features'
import { PageNotFound } from '../layouts'

Routes.push({ path: '*', name: 'Page not found', component: PageNotFound })

const routes = [{
  path: '/',
  component: App,
  childRoutes: Routes.filter(r => r.component || (r.childRoutes && r.childRoutes.length > 0))
}]

// Handle isIndex property of route config:
//  1. remove the first child with isIndex=true if no path property from childRoutes
//  2. assign it to the indexRoute property of the parent.
function handleIndexRoute(route) {
  if (!route.childRoutes || !route.childRoutes.length) {
    return
  }

  route.childRoutes = route.childRoutes.filter(child => { // eslint-disable-line
    if (child.isIndex) {
      /* istanbul ignore next */
      if (process.env.NODE_ENV === 'dev' && route.indexRoute) {
        console.error('More than one index route: ', route)
      }

      /* istanbul ignore else */
      if (!route.indexRoute) {
        const indexRoute = { ...child }
        delete indexRoute.path
        route.indexRoute = indexRoute // eslint-disable-line
        if (!child.path) return false
      }
    }
    return true
  });

  route.childRoutes.forEach(handleIndexRoute)
}

routes.forEach(handleIndexRoute)
export default routes