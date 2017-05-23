import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Menu, Icon } from 'antd'
import './index.scss'
import { adminsSub } from '../../features/admins/admins'
import { userSub } from '../../features/user/user'
import { partlibSub } from '../../features/partlib/partlib'
const { SubMenu, ItemGroup } = Menu
import _ from 'lodash'

@connect( state => state )
export default class Sider extends Component {

  render () {
    const { routing } = this.props
    const { locationBeforeTransitions } = routing
    const { pathname } = locationBeforeTransitions
    const pathMatch = pathname.match(/^(\/)([a-z]+)/)
    return (
      <div className={'app-sider'}>
        <Menu
          mode={'inline'}
          theme={'dark'}
          defaultOpenKeys={[pathMatch && pathMatch[2]]}
          selectedKeys={[pathname.toLowerCase()]}
          inlineIndent={22} >
          {this.renderSubMenu(`partlib`, `零件库`, `database`, partlibSub)}
          {this.renderSubMenu(`admins`, `帐号管理`, `team`, adminsSub)}
          {this.renderSubMenu(`user`, `用户中心`, `user`, userSub)}
        </Menu>
      </div>
    )
  }

  renderSubMenu (key, name, icon, data) {
    return (
      <SubMenu
        key={key}
        title={<span><Icon type={icon || 'appstore'} /><span>{name}</span></span>} >
        {data.map( (item, i) => {
          return(
            <Menu.Item key={`/${item.path}/${item.key}`}>
              <Link to={`/${item.path}/${item.key}`}>{item.name}</Link>
            </Menu.Item>
          )
        })}
      </SubMenu>
    )
  }
}