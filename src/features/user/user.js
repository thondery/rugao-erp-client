import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Breadcrumb } from 'antd'
import { CoreLayout } from '../../layouts'
import { Layout, CardList } from '../../components'

@connect(state => state)
export default class User extends Component {

  render () {
    const { location } = this.props
    return (
      <CoreLayout>
        {this.renderHeader()}
        <div>
          <CardList data={userSub} />
        </div>
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/user`}>{'用户中心'}</Link></Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}

export const userSub = [
  { key: 'baseinfo', name: '基本资料', path: 'user' },
  { key: 'editpwd', name: '修改密码', path: 'user'}
]