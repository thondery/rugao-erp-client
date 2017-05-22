import User from './user'
import { 
  PassportEditPwd, 
  PassportBaseInfo 
} from '../../passport'

export default {
  path: 'user',
  name: 'User',
  childRoutes: [
    { path: '', name: 'User', component: User, isIndex: true },
    { path: 'baseinfo', name: 'BaseInfo', component: PassportBaseInfo },
    { path: 'editpwd', name: 'EditPwd', component: PassportEditPwd },
  ]
}