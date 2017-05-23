import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Breadcrumb, Form, Input, InputNumber, Select, Button, Icon, Table, Popconfirm, Modal } from 'antd'
import { CoreLayout } from '../../../layouts'
import * as actions from './action'
import EditModal from './edit'
import AddModal from './add'

@connect(
  state => ({
    ...state.Species,
    auth: state.passport.auth
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class Species extends Component {

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
      pageCode: '1001',
      auth
    }
    const columns = [
      {
        title: '种类名称',
        dataIndex: 'name',
        key: 'name',
        width: 150,
      },
      {
        title: '零件数',
        dataIndex: 'counts',
        key: 'counts',
        width: 100,
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
        render: (text, record) => (
          <span>
            <a onClick={() => this.setState({ model: 'edit', selectId: record.sid })}>编辑</a>
            <span className="ant-divider" />
              <Popconfirm title={`确定要删除该种类吗？`}
                onConfirm={() => this.props.actions.remove(record.sid)}>
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
            onClick={() => this.setState({ model: 'add', selectId: null })} >
            添加种类
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
        <Breadcrumb.Item><Link to={`/partlib`}>{'零件库'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{'零件种类'}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}

const listDataByKey = (data) => {
  for (let e of data) {
    e.key = e.sid
  }
}