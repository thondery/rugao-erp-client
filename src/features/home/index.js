import Home from './home'

export default {
  path: '',
  name: 'Home',
  component: Home,
  childRoutes: [
    { path: 'home', name: 'home', component: Home, isIndex: true }
  ]
}