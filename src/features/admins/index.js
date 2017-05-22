import Admins from './admins'
import AdminGroup from './group'
import AdminUser from './user'

export default {
  path: 'admins',
  name: 'Admins',
  childRoutes: [
    { path: '', name: 'Admins', component: Admins, isIndex: true },
    { path: 'group', name: 'AdminGroup', component: AdminGroup },
    { path: 'user', name: 'AdminUser', component: AdminUser },
  ]
}