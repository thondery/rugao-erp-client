import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Button, Input, InputNumber, Select, message } from 'antd'
import * as actions from './action'
import { getlist } from '../part/action'
import _ from 'lodash'
import { httpServices } from 'http-services'
import config from '../../../config'
import { getToken } from '../../../services/token'

const { domain, apiPath } = config
const HttpServices = new httpServices(domain, apiPath)

const FormItem = Form.Item
const Option = Select.Option
const WareHouse = {
  ['import']: {
    name: '入库'
  },
  ['output']: {
    name: '出库'
  },
}

@connect(
  state => ({
    partListPending: state.Part.getListPending,
    partListError: state.Part.getListError,
    partListMessage: state.Part.getListMessage,
    parts: state.Part.listData,
    addPending: state.Warehouse.addPending,
    addError: state.Warehouse.addError,
    addMessage: state.Warehouse.addMessage,
  }),
  dispatch => ({
    actions: bindActionCreators({...actions, partList: getlist }, dispatch)
  })
)
export default class AddModal extends Component {
  static PropTypes = {
    visible: PropTypes.bool,
    closeModel: PropTypes.func,
  }

  static defaultProps = {
    visible: false,
    closeModel: () => null
  }

  constructor (props) {
    super(props)
    this.state = {
      btnDisabled: true
    }
  }

  componentDidMount () {
    this.props.actions.partList()
  }

  componentWillReceiveProps (nextProps) {
    const { visible, addPending, addError, addMessage } = nextProps
    if (addError !== this.props.addError) {
      addError === 0 && this.handleCancel()
      addError > 0 && message.error(addMessage)
    }
    if (visible === this.props.visible) return
  }

  render () {
    const { addPending, parts, type } = this.props
    const tagName = WareHouse[type] && WareHouse[type].name
    const setting = {
      title: `零件${tagName}单`,
      onCancel: this.handleCancel.bind(this),
      onOk: this.handleOk.bind(this),
      visible: this.props.visible,
      footer: [
        <Button
          key={'back'}
          size={'large'}
          onClick={this.handleCancel.bind(this)}>
          取消
        </Button>,
        <Button
          key={'create'}
          size={'large'}
          type={'primary'}
          loading={addPending}
          disabled={this.state.btnDisabled && type === 'output'}
          onClick={this.handleOk.bind(this)}>
          提交
        </Button>
      ],
      //width: 800,
      maskClosable: false
    }
    return (
      <Modal {...setting}>
        <WrappedAddForm 
          ref={'addForm'}
          tagName={tagName}
          parts={parts}
          onChange={this.handleChange.bind(this)} />
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.addForm.resetFields()
    this.props.closeModel()
  }

  handleChange (values) {
    const fields = {...this.refs.addForm.getFieldsValue(), ...values }
    this.setState({ btnDisabled: fields.max === 0 || fields.max < fields.count })
  }

  handleOk () {
    this.refs.addForm.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values)
        this.props.actions.saveAdd({
          part       : values.part,
          count      : values.count,
          type       : this.props.type
        })
      }
    })
  }
}

const WrappedAddForm = Form.create()(React.createClass({
  getInitialState () {
    return {
      maxCount: 0
    }
  },
  render () {
    const { parts, tagName } = this.props
    const { getFieldDecorator, getFieldsValue } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    console.log(getFieldsValue())
    return (
      <Form layout={'horizontal'} className={'app-modal-form'}>
        <FormItem
          {...formItemLayout}
          label={`${tagName}零件`}
          hasFeedback>
          {getFieldDecorator('part', {
            rules: [
              { required: true, message: '请选择一个零件!' }
            ]
          })(
            <Select style={{ width: 300 }}
              showSearch
              filterOption={(input, option) => {
                const children = option.props.children
                return children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0 || children[3].toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}
              onChange={this.handleChangeByPart}
              placeholder="请选择零件">
              {parts.map( (item, i) => {
                return (
                  <Option key={i} value={item._id}>[{item.model}]{item.name}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={`${tagName}数量`}
          hasFeedback >
          {getFieldDecorator('count', {
            rules: [],
            initialValue: this.state.maxCount === 0 && tagName === '出库' ? 0 : 1
          })(
            <InputNumber 
              min={this.state.maxCount === 0 && tagName === '出库' ? 0 : 1} 
              max={tagName === '出库' ? this.state.maxCount : 9999} 
              onChange={this.handleChangeByCount}
              disabled={this.state.maxCount === 0 && tagName === '出库'} />
          )}
        </FormItem>
      </Form>
    )
  },
  handleChangeByPart (_id) {
    const token = getToken()
    HttpServices.GET('/partlib/part', { accesstoken: token })
      .then( ret => {
        const { data, status } = ret
        if (data) {
          const selectItem = _.find(data.parts, { _id })
          this.setState({ maxCount: selectItem.counts })
          this.props.onChange({ max: selectItem.counts })
        }
      })
  },
  handleChangeByCount (count) {
    this.props.onChange({ max: this.state.maxCount, count })
  }
}))