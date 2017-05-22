import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Breadcrumb } from 'antd'
import { CoreLayout } from '../../layouts'
import { Layout, CardList } from '../../components'

@connect(state => state)
export default class Admins extends Component {

  render () {
    const { location } = this.props
    return (
      <CoreLayout>
        {this.renderHeader()}
        <div>
          <CardList data={adminsSub} />
        </div>
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/admins`}>{'帐号管理'}</Link></Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}





export const adminsSub = [
  { key: 'group', name: '管理组设定', path: 'admins' },
  { key: 'user', name: '用户管理', path: 'admins'}
]