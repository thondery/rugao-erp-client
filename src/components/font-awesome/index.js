import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import 'font-awesome/css/font-awesome.css'

export default class FontAwesome extends Component {
  static propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
    larger: PropTypes.oneOf(['lg', '2x', '3x', '4x', '5x']),
    animated: PropTypes.oneOf([undefined, 'spin', 'pulse']),
    rotated: PropTypes.oneOf([0, 90, 180, 270]),
    style: PropTypes.object,
    onClick: PropTypes.func
  }

  static defaultProps = {
    className: undefined,
    larger: 'lg',
    animated: undefined,
    rotated: 0,
    style: null,
    onClick: null
  }

  render () {
    const { className, type, larger, animated, style, rotated, onClick } = this.props
    const classname = classnames(
      'fa', 
      `fa-${type}`, 
      `fa-${larger}`,
      animated ? `fa-${animated}` : undefined,
      rotated > 0 ? `fa-rotate-${rotated}` : undefined,
      className)
    const opts = { style, onClick }
    return (
      <i {...opts}
        className={classname} 
        aria-hidden={true} />
    )
  }
}