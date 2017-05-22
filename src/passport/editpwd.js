import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Breadcrumb, Form, Icon, Input, Button, message, Modal } from 'antd'
import { CoreLayout } from '../layouts'
import * as actions from './action'
//import '../styles/passport.scss'
const FormItem = Form.Item

@connect(
  state => ({
    editPwdPending: state.passport.editPwdPending,
    editPwdError: state.passport.editPwdError,
    editPwdMessage: state.passport.editPwdMessage,
    auth: state.passport.auth
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class EditPwd extends Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }

  render () {
    const { auth } = this.props
    const setting = {
      pageCode: '8002',
      auth
    }
    return (
      <CoreLayout {...setting}>
        {this.renderHeader()}
        <WrappedEditPwdForm 
          ref={'editPwd'}
          handleSubmit={this.handleSubmit.bind(this)} />
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/user`}>{'用户中心'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{'修改密码'}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  handleSubmit () {
    this.refs.editPwd.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        this.props.actions.editpwd(values.password)
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    const { editPwdPending, editPwdMessage, editPwdError } = nextProps
    if (editPwdError > 0) {
      message.error(editPwdMessage)
    }
    if (editPwdError === 0) {
      this.refs.editPwd.resetFields()
      Modal.success({
        title: '修改成功',
        content: '您的密码已经更新！'
      })
    }
  }

}

const WrappedEditPwdForm = Form.create()(React.createClass({

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 }
    }
    const tailFormItemLayout = {
      wrapperCol: {
        span: 14,
        offset: 8,
      }
    }
    return (
      <Form layout={'horizontal'} 
        style={{ maxWidth: 500, marginTop: 30 }}>
        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '新密码不能为空!' },
              { validator: this.checkPassword, message: '只允许6～24个英文字母加数字和减号下划线组成！' }
            ],
          })(
            <Input type="password" placeholder={'输入新密码'} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="确认密码"
          hasFeedback>
          {getFieldDecorator('confirmPassword', {
            rules: [
              { validator: this.checkConfirmPassword, message: '两次输入的密码不相同，请确认！' }
            ],
          })(
            <Input type="password" placeholder={'确认新密码'} />
          )}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.props.handleSubmit} size="large">确认修改</Button>
        </FormItem>

      </Form>
    )
  },
  checkPassword (rule, value, callback) {
    const form = this.props.form
    const reg = /^[0-9a-z\-\_]{6,24}$/
    if (value && !reg.test(value)) {
      callback(rule.message)
    }
    callback()
  },
  checkConfirmPassword (rule, value, callback) {
    const form = this.props.form
    const { password, confirmPassword } = form.getFieldsValue()
    if (password !== confirmPassword) {
      callback(rule.message)
    }
    callback()
  }
}))