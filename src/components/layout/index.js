import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import './index.scss'

export default class Layout extends Component {
  static propTypes = {
    children: PropTypes.node,
    direction: PropTypes.oneOf(['column', 'row', 'column-reverse', 'row-reverse']),
    className: PropTypes.string,
    style: PropTypes.object
  }

  static defaultProps = {
    children: null,
    direction: 'row',
    className: undefined,
    style: null
  }

  constructor (props) {
    super(props)
    this.state = {

    }
  }

  render () {
    const { direction, className, children, style } = this.props
    return (
      <div 
        className={classnames('app-layout', className)} 
        style={{ flexDirection: direction, ...style }} >
        {children}
      </div>
    )
  }
}