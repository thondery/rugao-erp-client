import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { Breadcrumb } from 'antd'
import { CoreLayout } from '../../layouts'
import { Layout, CardList } from '../../components'

@connect(state => state)
export default class Partlib extends Component {

  render () {
    const { location } = this.props
    return (
      <CoreLayout>
        {this.renderHeader()}
        <div>
          <CardList data={partlibSub} />
        </div>
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/partlib`}>{'零件库'}</Link></Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}



export const partlibSub = [
  { key: 'species', name: '零件种类', path: 'partlib' },
  { key: 'part', name: '零件管理', path: 'partlib'}
]