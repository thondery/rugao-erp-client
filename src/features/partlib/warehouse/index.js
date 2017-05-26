import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Breadcrumb, Form, Input, InputNumber, Select, Button, Icon, Table, Popconfirm, Modal } from 'antd'
import { CoreLayout } from '../../../layouts'
import * as actions from './action'
import AddModal from './add'
import moment from 'moment'

const ButtonGroup = Button.Group

@connect(
  state => ({
    ...state.Warehouse,
    auth: state.passport.auth
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class Warehouse extends Component {

  constructor (props) {
    super(props)
    this.state = {
      model: null
    }
  }

  componentDidMount () {
    this.props.actions.getlist()
  }

  render () {
    const { auth, getListPending, listData } = this.props
    const setting = {
      pageCode: '1003',
      auth
    }
    const columns = [
      {
        title: '出入库单号',
        dataIndex: '_id',
        key: '_id',
        width: 190,
      },
      {
        title: '零件名称',
        dataIndex: 'part',
        key: 'part',
        //width: 200,
        render: (part) => <span>[{part.model}] {part.name}</span>
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 60,
        render: (type) => <span>{type === 'output' ? '出库' : '入库'}</span>
      },
      {
        title: '数量',
        dataIndex: 'count',
        key: 'count',
        width: 80,
      },
      {
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
        width: 120,
        render: (operator) => <span>{operator.username}</span>
      },
      {
        title: '操作时间',
        dataIndex: 'createAt',
        key: 'createAt',
        width: 180,
        render: (createAt) => <span>{moment(createAt).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      /*{
        title: '描述',
        key: 'desc',
        width: 300,
        render: () => <span>--</span>,
      },*/
      /*{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            --
          </span>
        )
      }*/
    ]
    listDataByKey(listData || [])
    return (
      <CoreLayout {...setting}>
        {this.renderHeader()}
        <div style={{ marginBottom: 20 }}>
          <ButtonGroup>
            <Button
              size={'large'}
              //type={'primary'}
              icon={'download'}
              //disabled={!this.props.species || this.props.species.length === 0}
              onClick={() => this.setState({ model: 'import' })} >
              入库
            </Button>
            <Button
              size={'large'}
              //type={'primary'}
              icon={'upload'}
              //disabled={!this.props.species || this.props.species.length === 0}
              onClick={() => this.setState({ model: 'output' })} >
              出库
            </Button>
          </ButtonGroup>
        </div>
        <Table 
          columns={columns} 
          dataSource={listData}
          bordered
          //pagination={false}
          //scroll={{ y: 520 }}
          loading={getListPending} />
        <AddModal
          visible={['import', 'output'].indexOf(this.state.model) > -1}
          type={this.state.model}
          closeModel={() => this.setState({ model: null })} />
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/partlib`}>{'零件库'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{'出入库管理'}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

}

const listDataByKey = (data) => {
  for (let e of data) {
    e.key = e._id
  }
}