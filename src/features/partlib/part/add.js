import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Button, Input, Select, message } from 'antd'
import * as actions from './action'
import _ from 'lodash'

const FormItem = Form.Item
const Option = Select.Option

@connect(
  state => ({
    addPending: state.Part.addPending,
    addError: state.Part.addError,
    addMessage: state.Part.addMessage,
    species: state.Part.species
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
    const { addPending, species } = this.props
    const setting = {
      title: '添加零件',
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
      //width: 800,
      maskClosable: false
    }
    return (
      <Modal {...setting}>
        <WrappedPartForm 
          ref={'addPart'}
          species={species} />
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.addPart.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    
  }

  handleOk () {
    this.refs.addPart.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values)
        this.props.actions.saveAdd({
          model       : values.model,
          name        : values.name,
          species     : values.species
        })
      }
    })
  }
}

const WrappedPartForm = Form.create()(React.createClass({

  render () {
    const { species } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Form layout={'horizontal'} className={'app-modal-form'}>
        <FormItem
          {...formItemLayout}
          label="零件型号"
          hasFeedback>
          {getFieldDecorator('model', {
            rules: [
              { required: true, message: '零件型号不能为空!' }
            ]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="零件名称"
          hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '零件名称不能为空!' }
            ]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="零件种类"
          hasFeedback>
          {getFieldDecorator('species', {
            rules: [
              { required: true, message: '零件种类不能为空!' }
            ]
          })(
            <Select style={{ width: 200 }} placeholder="请选择零件种类">
              {species.map( (item, i) => {
                return (
                  <Option key={i} value={item.sid}>{item.name}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
      </Form>
    )
  }
}))