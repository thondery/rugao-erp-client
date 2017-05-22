import React, { Component, PropTypes } from 'react'
import { Layout, Permission, FontAwesome } from '../../components'
import Header from '../header'
import Sider from '../sider'

export default class CoreLayout extends Component {
  static propTypes = {
    pageCode: PropTypes.string,
    auth: PropTypes.object,
    children: PropTypes.node
  }

  static defaultProps = {
    pageCode: 'none',
    auth: null,
    children: null
  }

  render () {
    const { children, pageCode, auth } = this.props
    const permissionView = this.renderPermission()
    return (
      <Layout direction={'column'}>
        <Header />
        <Layout>
          <Sider />
          <Permission 
            pageCode={pageCode} 
            flag={auth && auth.group.flag || []}
            viewComponent={permissionView}>
            {children}
          </Permission>
        </Layout>
      </Layout>
    )
  }

  renderPermission () {
    return (
      <Layout 
        className={'app-warning-wraper'}
        direction={'column'}>
        <FontAwesome type={'exclamation-triangle'} />
        <h2>对不起，您尚未获得当前页面的操作权限！</h2>
      </Layout>
    )
  }
}