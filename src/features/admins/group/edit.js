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
    editPending: state.AdminGroup.editPending,
    editError: state.AdminGroup.editError,
    editMessage: state.AdminGroup.editMessage,
    listData: state.AdminGroup.listData
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
    const { selectId, listData, editPending } = this.props
    const useGroup = _.find(listData, { gid: selectId })
    const setting = {
      title: '编辑管理组',
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
      width: 800,
      maskClosable: false
    }
    return (
      <Modal {...setting}>
        {useGroup ? (
          <WrappedGroupForm 
            ref={'editGroup'}
            data={useGroup} />
        ) : null}
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.editGroup.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    const fields = this.refs.editGroup.getFieldsValue()
    console.log(fields)
  }

  handleOk () {
    const { selectId } = this.props
    this.refs.editGroup.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values, selectId)
        this.props.actions.saveEdit(selectId, {
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
    const { data } = this.props
    const { getFieldDecorator, getFieldValue, onChange } = this.props.form
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
            ],
            initialValue: data.name
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
            initialValue: data.level
          })(
            <InputNumber min={0} max={99} disabled={data.lock} />
          )}
        </FormItem><FormItem
          {...formItemLayout}
          label="权 限"
          hasFeedback>
          {getFieldDecorator('flag', {
            rules: [],
            initialValue: data.flag
          })(
            <CheckboxGroup options={flagOptions(data.lock)} />
          )}
        </FormItem>
      </Form>
    )
  }
}))

const flagOptions = (lock) => {
  const options = []
  for (let e of flagData) {
    options.push({
      label: e.name,
      value: e.code,
      disabled: lock
    })
  }
  return options
}