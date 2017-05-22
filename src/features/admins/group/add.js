import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Button, Input, InputNumber, Checkbox, message } from 'antd'
import * as actions from './action'
import flagData from '../../../data/flag.json'
import _ from 'lodash'

const FormItem = Form.Item
const CheckboxGroup = Checkbox.Group

@connect(
  state => ({
    addPending: state.AdminGroup.addPending,
    addError: state.AdminGroup.addError,
    addMessage: state.AdminGroup.addMessage
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class AddModal extends Component {
  static PropTypes = {
    visible: PropTypes.bool,
    closeModel: PropTypes.func
  }

  static defaultProps = {
    visible: false,
    closeModel: () => null
  }

  constructor (props) {
    super(props)
    this.state = {
      
    }
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
    const { addPending } = this.props
    const setting = {
      title: '创建管理组',
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
          onClick={this.handleOk.bind(this)}>
          提交
        </Button>
      ],
      width: 800,
      maskClosable: false
    }
    return (
      <Modal {...setting}>
        <WrappedGroupForm 
          ref={'addGroup'} />
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.addGroup.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    
  }

  handleOk () {
    this.refs.addGroup.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values, selectId)
        this.props.actions.saveAdd({
          name    : values.name,
          level   : values.level,
          flag    : values.flag
        })
      }
    })
  }
}

const WrappedGroupForm = Form.create()(React.createClass({

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Form layout={'horizontal'} className={'app-modal-form'}>
        <FormItem
          {...formItemLayout}
          label="组称谓"
          hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '组称谓不能为空!' }
            ]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="权 级"
          hasFeedback>
          {getFieldDecorator('level', {
            rules: [],
            initialValue: 99
          })(
            <InputNumber min={0} max={99} />
          )}
        </FormItem><FormItem
          {...formItemLayout}
          label="权 限"
          hasFeedback>
          {getFieldDecorator('flag', {
            rules: []
          })(
            <CheckboxGroup options={flagOptions()} />
          )}
        </FormItem>
      </Form>
    )
  }
}))

const flagOptions = () => {
  const options = []
  for (let e of flagData) {
    options.push({
      label: e.name,
      value: e.code
    })
  }
  return options
}