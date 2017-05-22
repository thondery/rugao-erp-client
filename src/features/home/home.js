import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { Breadcrumb } from 'antd'
import { Layout, CardList } from '../../components'
import { CoreLayout } from '../../layouts'
import { adminsSub } from '../admins/admins'
import _ from 'lodash'

@connect (
  state => ({
    auth: state.passport.auth
  })
)
export default class Home extends Component {

  render () {
    const { routes, params, auth } = this.props
    return (
      <CoreLayout>
        <Breadcrumb>
          <Breadcrumb.Item><Link to={`/admins`}>{'后台帐号管理'}</Link></Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <CardList data={adminsSub} />
        </div>
      </CoreLayout>
    )
  }
}