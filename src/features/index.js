// ------------------------------------
// Routes & Reducers
// ------------------------------------
import Home from './home'
import HomeReducer from './home/reducer'
import Admins from './admins'
import AdminGroupReducer from './admins/group/reducer'
import AdminUserReducer from './admins/user/reducer'
import User from './user'

export const Routes = [
  Home,
  Admins,
  User
]

export const Reducers = {
  Home                : HomeReducer,
  AdminGroup          : AdminGroupReducer,
  AdminUser           : AdminUserReducer
}