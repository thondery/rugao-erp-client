import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Breadcrumb, Form, Input, InputNumber, Select, Button, Icon, Table, Popconfirm, Modal } from 'antd'
import { CoreLayout } from '../../../layouts'
import * as actions from './action'
import EditModal from './edit'
import AddModal from './add'

const Option = Select.Option

@connect(
  state => ({
    ...state.Part,
    auth: state.passport.auth
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class Part extends Component {

  constructor (props) {
    super(props)
    this.state = {
      model: null,
      selectId: null,
      species: 'all',
      searchText: undefined
    }
  }

  componentDidMount () {
    this.props.actions.getlist()
  }

  render () {
    const { auth, getListPending, listData } = this.props
    const setting = {
      pageCode: '1002',
      auth
    }
    const columns = [
      {
        title: '零件型号',
        dataIndex: 'model',
        key: 'model',
        width: 150,
      },
      {
        title: '零件名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
      },
      {
        title: '种类',
        dataIndex: 'species',
        key: 'species',
        width: 100,
        render: (species) => <span>{species.name}</span>
      },
      {
        title: '库存数',
        dataIndex: 'counts',
        key: 'counts',
        width: 160,
        render: (counts) => <span>{counts.toLocaleString('en-US')}</span>,
      },
      /*{
        title: '描述',
        key: 'desc',
        width: 300,
        render: () => <span>--</span>,
      },*/
      {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={() => this.setState({ model: 'edit', selectId: record._id })}>编辑</a>
            <span className="ant-divider" />
              <Popconfirm title={`确定要删除该零件吗？`}
                onConfirm={() => this.props.actions.remove(record._id)}>
                <a>删除</a>
              </Popconfirm>
          </span>
        )
      }
    ]
    listDataByKey(listData || [])
    let _listData = this.state.species === 'all' ? listData : _.filter(listData, o => o.species.sid === this.state.species)
    if (this.state.searchText) {
      const searchText = new RegExp(this.state.searchText.toLocaleLowerCase())
      _listData = _.filter(_listData, o => searchText.test(o.name.toLocaleLowerCase()) || searchText.test(o.model.toLocaleLowerCase()) )
    }
    
    const Species = _.concat([
      {
        sid: 'all',
        name: '全部'
      }
    ], this.props.species || [])
    return (
      <CoreLayout {...setting}>
        {this.renderHeader()}
        <div style={{ marginBottom: 20 }}>
          <Button
            size={'large'}
            type={'primary'}
            disabled={!this.props.species || this.props.species.length === 0}
            onClick={() => this.setState({ model: 'add', selectId: null })} >
            添加零件
          </Button>
          <Select 
            size={'large'}
            style={{ width: 200, marginLeft: 20 }} 
            defaultValue={this.state.species}
            onChange={this.handleChangeBySpecies.bind(this)}
            >
            {Species.map( (item, i) => {
              return (
                <Option key={i} value={item.sid}>{item.name}</Option>
              )
            })}
          </Select>
          <Input
            size={'large'}
            style={{ width: 200, marginLeft: 10 }} 
            placeholder={'按型号或名称检索'}
            value={this.state.searchText}
            onChange={this.handleChangeBySearch.bind(this)} />
        </div>
        <Table 
          columns={columns} 
          dataSource={_listData}
          bordered
          //pagination={false}
          //scroll={{ y: 520 }}
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
        <Breadcrumb.Item>{'零件管理'}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  handleChangeBySpecies (value) {
    this.setState({ species: value, searchText: undefined })
  }

  handleChangeBySearch (e) {
    const { value } = e.target
    this.setState({ searchText: value })
  }
}

const listDataByKey = (data) => {
  for (let e of data) {
    e.key = e._id
  }
}