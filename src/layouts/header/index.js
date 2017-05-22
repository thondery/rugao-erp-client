import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link, browserHistory, hashHistory } from 'react-router'
import classnames from 'classnames'
import { Dropdown, Menu, Icon, Tag, Badge, Input } from 'antd'
import { Layout, FontAwesome } from '../../components'
import './index.scss'

import { passportActions } from '../../passport'

const history = __DESKTOP__ ? hashHistory : browserHistory
const menus = [
  {
    key: '9001',
    name: '基本资料',
    icon: 'wpforms'
  },
  {
    key: '9002',
    name: '修改密码',
    icon: 'address-card'
  },
  /*{
    key: '9002',
    name: '实名认证',
    icon: 'user-circle'
  },
  {
    key: '9003',
    name: '安全设置',
    icon: 'cog'
  },
  {
    key: '9004',
    name: '安全管控',
    icon: 'lock'
  },
  {
    key: '9005',
    name: '访问控制',
    icon: 'address-card'
  },
  {
    key: '9006',
    name: 'access',
    icon: 'code'
  },
  {
    key: '9007',
    name: '会员中心',
    icon: 'user-circle-o'
  },*/
]

@connect (
  state => state,
  dispatch => ({
    actions: bindActionCreators({...passportActions}, dispatch)
  })
)
export default class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }

  render () {
    const { passport } = this.props
    const { auth } = passport
    const usrPanel = (
      <Menu 
        className={classnames('app-header-menu', 'app-header-menu-userpanel')}
        onClick={this.handleClick.bind(this)} >
        {menus.map( (item, i) => 
          <Menu.Item 
            key={item.key}
            className={'app-header-menu-userpanel-item'} 
            direction="column">
            <FontAwesome type={item.icon} />
            <span>{item.name}</span>
          </Menu.Item>
        )}
        <Menu.Divider className={'app-header-menu-userpanel-driver'} />
        <Menu.Item key={'9999'} className={'app-header-menu-userpanel-span'} >
          <span>退出管理控制台</span>
        </Menu.Item>
      </Menu>
    )
    return (
      <Layout className={'app-header'}>
        <Layout className={'app-header-start'}>
          <Link to={'/'} className={classnames('app-header-link', 'app-header-logo')}>
            <img src={require('../../assets/images/Icon-60@2x.png')} />
          </Link>
          <Link to={'/'} className={classnames('app-header-link', 'app-header-dashboard')}>
            <span>管理控制台</span>
          </Link>
        </Layout>
        <Layout className={'app-header-end'}>
          {/*<Dropdown 
            overlay={HelpPanel}
            getPopupContainer={() => document.getElementById('app-header-panel-help')}>
            <div id="app-header-panel-help"
              className={'app-header-link-div'} >
              <Link to={'/'} 
                className={'app-header-link'}>
                <span>支持</span>
              </Link>
            </div>
          </Dropdown>*/}
          <Dropdown 
            overlay={usrPanel}
            getPopupContainer={() => document.getElementById('app-header-userpanel')}
            >
            <div id="app-header-userpanel"
              className={'app-header-link-div'} >
              <Link 
                className={'app-header-link'}>
                <span>{auth.username}</span>
              </Link>
            </div>
          </Dropdown>
        </Layout>
      </Layout>
    )
  }

  handleClick ({key}) {
    switch (key) {
      case '9001': 
        history.push(`/user/baseinfo`)
        break
      case '9002': 
        history.push(`/user/editpwd`)
        break
      case '9999': 
        this.props.actions.logout()
        break
      default:
        break
    }
  }
}