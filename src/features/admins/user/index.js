import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Breadcrumb, Form, Input, InputNumber, Select, Button, Icon, Table, Popconfirm } from 'antd'
import { CoreLayout } from '../../../layouts'
import * as actions from './action'
import EditModal from './edit'
import AddModal from './add'

@connect(
  state => ({
    ...state.AdminUser,
    auth: state.passport.auth
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class AdminUser extends Component {

  constructor (props) {
    super(props)
    this.state = {
      model: null,
      selectId: null
    }
  }

  componentDidMount () {
    this.props.actions.getlist()
  }

  render () {
    const { auth, getListPending, listData } = this.props
    const setting = {
      pageCode: '9002',
      auth
    }
    const columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        width: 100,
      },
      {
        title: '管理组',
        dataIndex: 'group',
        key: 'group',
        width: 200,
        render: (group) => <span>{group.name}[{group.level}]</span>
      },
      {
        title: '描述',
        key: 'desc',
        width: 300,
        render: () => <span>--</span>,
      },
      {
        title: '操作',
        key: 'action',
        render: (text, record) => record.group.lock ? (
          <span>
            <a onClick={() => this.setState({ model: 'edit', selectId: record.uid })}>编辑</a>
          </span>
        ) : (
          <span>
            <a onClick={() => this.setState({ model: 'edit', selectId: record.uid })}>编辑</a>
            <span className="ant-divider" />
            <Popconfirm title={`确定要删除该用户吗？`}
              onConfirm={() => this.props.actions.remove(record.uid)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      }
    ]
    listDataByKey(listData || [])
    return (
      <CoreLayout {...setting}>
        {this.renderHeader()}
        <div style={{ marginBottom: 20 }}>
          <Button
            size={'large'}
            type={'primary'}
            disabled={!this.props.groups || this.props.groups.length === 0}
            onClick={() => this.setState({ model: 'add', selectId: null })} >
            创建用户
          </Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={listData}
          pagination={false}
          loading={getListPending} />
        <EditModal 
          visible={this.state.model === 'edit'}
          selectId={this.state.selectId}
          closeModel={() => this.setState({ model: null, selectId: null })} />
        <AddModal
          visible={this.state.model === 'add'}
          closeModel={() => this.setState({ model: null, selectId: null })} />
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/admins`}>{'帐号管理'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{'用户管理'}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}

const listDataByKey = (data) => {
  for (let e of data) {
    e.key = e.uid
  }
}