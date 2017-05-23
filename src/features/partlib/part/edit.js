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
    editPending: state.Part.editPending,
    editError: state.Part.editError,
    editMessage: state.Part.editMessage,
    listData: state.Part.listData,
    species: state.Part.species
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
    const { selectId, listData, editPending, species } = this.props
    const useData = _.find(listData, { _id: selectId })
    const setting = {
      title: '编辑零件信息',
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
        {useData ? (
          <WrappedPartForm 
            ref={'editPart'}
            data={useData}
            species={species} />
        ) : null}
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.editPart.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    const fields = this.refs.editPart.getFieldsValue()
    console.log(fields)
  }

  handleOk () {
    const { selectId } = this.props
    this.refs.editPart.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values, selectId)
        this.props.actions.saveEdit(selectId, {
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
    const { data, species } = this.props
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
              { required: true, message: '零件型号不能为空!' },
            ],
            initialValue: data.model
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
              { required: true, message: '零件名称不能为空!' },
            ],
            initialValue: data.name
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="零件种类"
          hasFeedback>
          {getFieldDecorator('speciies', {
            rules: [
              { required: true, message: '零件种类不能为空!' }
            ],
            initialValue: data.species.sid
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