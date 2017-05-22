import React, { Component, PropTypes } from 'react'
import './index.scss'

export default class Permission extends Component {
  static PropTypes = {
    className: PropTypes.string,
    style: PropTypes.object,
    pageCode: PropTypes.string.isRequired,
    flag: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.element,
    viewComponent: PropTypes.element
  }

  static defaultProps = {
    className: 'app-layout-body',
    style: null,
    flag: [],
    children: null,
    viewComponent: (
      <div>
        <h1>Page Not Permission.</h1>
      </div>
    )
  }

  render () {
    const { flag, children, pageCode, viewComponent, className, style } = this.props
    return (
      <div className={className} style={style}>
        {flag.indexOf(pageCode) > -1 || pageCode === 'none' ? children : viewComponent}
      </div>
    )
  }
}