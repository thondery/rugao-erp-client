import Partlib from './partlib'
import Species from './species'
import Part from './part'

export default {
  path: 'partlib',
  name: 'Partlib',
  childRoutes: [
    { path: '', name: 'Partlib', component: Partlib, isIndex: true },
    { path: 'species', name: 'Species', component: Species },
    { path: 'part', name: 'Part', component: Part },
  ]
}