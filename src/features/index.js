// ------------------------------------
// Routes & Reducers
// ------------------------------------
import Home from './home'
import HomeReducer from './home/reducer'
import Admins from './admins'
import AdminGroupReducer from './admins/group/reducer'
import AdminUserReducer from './admins/user/reducer'
import User from './user'
import Partlib from './partlib'
import SpeciesReducer from './partlib/species/reducer'
import PartReducer from './partlib/part/reducer'
import WarehouseReducer from './partlib/warehouse/reducer'

export const Routes = [
  Home,
  Admins,
  User,
  Partlib
]

export const Reducers = {
  Home                : HomeReducer,
  AdminGroup          : AdminGroupReducer,
  AdminUser           : AdminUserReducer,
  Species             : SpeciesReducer,
  Part                : PartReducer,
  Warehouse           : WarehouseReducer
}