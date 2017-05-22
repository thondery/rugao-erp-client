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
    addPending: state.AdminUser.addPending,
    addError: state.AdminUser.addError,
    addMessage: state.AdminUser.addMessage,
    groups: state.AdminUser.groups
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
    const { addPending, groups } = this.props
    const setting = {
      title: '创建用户',
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
        <WrappedUserForm 
          ref={'addUser'}
          groups={groups} />
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.addUser.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    
  }

  handleOk () {
    this.refs.addUser.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values)
        this.props.actions.saveAdd({
          username    : values.username,
          group       : values.group
        })
      }
    })
  }
}

const WrappedUserForm = Form.create()(React.createClass({

  render () {
    const { groups } = this.props
    const { getFieldDecorator, getFieldValue } = this.props.form
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 18 }
    }
    return (
      <Form layout={'horizontal'} className={'app-modal-form'}>
        <FormItem
          {...formItemLayout}
          label="用户名"
          hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              { required: true, message: '用户名不能为空!' },
              { validator: this.checkUsername, message: '只允许4～12个英文字母加数字和下划线组成！' }
            ]
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="管理组"
          hasFeedback>
          {getFieldDecorator('group', {
            rules: [
              { required: true, message: '管理组不能为空!' }
            ]
          })(
            <Select style={{ width: 200 }} placeholder="请选择管理组">
              {groups.map( (item, i) => {
                return (
                  <Option key={i} value={item.gid}>{item.name}[{item.level}]</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="提示"
          hasFeedback>
          <span>新创建的用户默认密码为 `123456`</span>
        </FormItem>
      </Form>
    )
  },
  checkUsername (rule, value, callback) {
    const form = this.props.form
    const reg = /^[0-9a-z\_]{4,12}$/
    if (!reg.test(value)) {
      callback(rule.message)
    }
    callback()
  }
}))