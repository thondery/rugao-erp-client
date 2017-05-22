import React, { Component } from 'react'
import { Link } from 'react-router'
import { Layout, FontAwesome } from '../../components'

export default class PageNotFound extends Component {

  // 组件判断是否重新渲染时调用
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }

  // 渲染组件
  render () {
    return (
      <Layout 
        className={'app-warning-wraper'}
        style={{ margin: 0 }}
        direction={'column'}>
        <FontAwesome type={'exclamation-triangle'} />
        <h2>很遗憾，未有找到您想访问的页面！</h2>
        <Link to={`/`}><FontAwesome type={'angle-right'} />{'返回首页'}</Link>
      </Layout>
    )
  }
}