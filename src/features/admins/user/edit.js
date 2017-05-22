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
    editPending: state.AdminUser.editPending,
    editError: state.AdminUser.editError,
    editMessage: state.AdminUser.editMessage,
    listData: state.AdminUser.listData,
    groups: state.AdminUser.groups
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class EditModal extends Component {
  static PropTypes = {
    visible: PropTypes.bool,
    closeModel: PropTypes.func,
    selectId: PropTypes.string
  }

  static defaultProps = {
    visible: false,
    closeModel: () => null,
    selectId: null
  }

  constructor (props) {
    super(props)
    this.state = {
      
    }
  }

  componentWillReceiveProps (nextProps) {
    const { visible, editPending, editError, editMessage } = nextProps
    if (editError !== this.props.editError) {
      editError === 0 && this.handleCancel()
      editError > 0 && message.error(editMessage)
    }
    if (visible === this.props.visible) return
  }

  render () {
    const { selectId, listData, editPending, groups } = this.props
    const useUser = _.find(listData, { uid: selectId })
    const setting = {
      title: '编辑用户信息',
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
          loading={editPending}
          onClick={this.handleOk.bind(this)}>
          提交
        </Button>
      ],
      //width: 800,
      maskClosable: false
    }
    return (
      <Modal {...setting}>
        {useUser ? (
          <WrappedUserForm 
            ref={'editUser'}
            data={useUser}
            groups={groups} />
        ) : null}
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.editUser.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    const fields = this.refs.editUser.getFieldsValue()
    console.log(fields)
  }

  handleOk () {
    const { selectId } = this.props
    this.refs.editUser.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values, selectId)
        this.props.actions.saveEdit(selectId, {
          username    : values.username,
          password    : values.password && values.password.length > 0 ? values.password : undefined,
          group       : values.group
        })
      }
    })
  }
}

const WrappedUserForm = Form.create()(React.createClass({

  render () {
    const { data, groups } = this.props
    const { getFieldDecorator, getFieldValue, onChange } = this.props.form
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
            ],
            initialValue: data.username
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="密 码"
          hasFeedback>
          {getFieldDecorator('password', {
            rules: [
              { validator: this.checkPassword, message: '只允许6～24个英文字母加数字和减号下划线组成！' }
            ]
          })(
            <Input type="password" placeholder="不更改密码无需填写" />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="管理组"
          hasFeedback>
          {getFieldDecorator('group', {
            rules: [
              { required: true, message: '管理组不能为空!' }
            ],
            initialValue: data.group.gid
          })(
            <Select style={{ width: 200 }} placeholder="请选择管理组" disabled={data.group.lock}>
              {data.group.lock ? (
                <Option value={data.group.gid}>{data.group.name}[{data.group.level}]</Option>
              ) : groups.map( (item, i) => {
                return (
                  <Option key={i} value={item.gid}>{item.name}[{item.level}]</Option>
                )
              })}
            </Select>
          )}
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
  },
  checkPassword (rule, value, callback) {
    const form = this.props.form
    const reg = /^[0-9a-z\-\_]{6,24}$/
    if (value && !reg.test(value)) {
      callback(rule.message)
    }
    callback()
  }
}))