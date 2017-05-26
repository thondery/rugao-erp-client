import Partlib from './partlib'
import Species from './species'
import Part from './part'
import Warehouse from './warehouse'

export default {
  path: 'partlib',
  name: 'Partlib',
  childRoutes: [
    { path: '', name: 'Partlib', component: Partlib, isIndex: true },
    { path: 'species', name: 'Species', component: Species },
    { path: 'part', name: 'Part', component: Part },
    { path: 'warehouse', name: 'Warehouse', component: Warehouse },
  ]
}