import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Button, Input, message } from 'antd'
import * as actions from './action'
import _ from 'lodash'

const FormItem = Form.Item

@connect(
  state => ({
    addPending: state.Species.addPending,
    addError: state.Species.addError,
    addMessage: state.Species.addMessage
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
      title: '添加零件种类',
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
        <WrappedSpeciesForm 
          ref={'addSpecies'} />
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.addSpecies.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    
  }

  handleOk () {
    this.refs.addSpecies.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values)
        this.props.actions.saveAdd({
          name    : values.name
        })
      }
    })
  }
}

const WrappedSpeciesForm = Form.create()(React.createClass({

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
          label="种类名称"
          hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '种类名称不能为空!' }
            ]
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    )
  }
}))