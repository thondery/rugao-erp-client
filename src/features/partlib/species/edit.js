import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Modal, Form, Button, Input, message } from 'antd'
import * as actions from './action'
import _ from 'lodash'

const FormItem = Form.Item

@connect(
  state => ({
    editPending: state.Species.editPending,
    editError: state.Species.editError,
    editMessage: state.Species.editMessage,
    listData: state.Species.listData
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
    const useSpecies = _.find(listData, { sid: selectId })
    const setting = {
      title: '编辑零件种类',
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
        {useSpecies ? (
          <WrappedSpeciesForm 
            ref={'editSpecies'}
            data={useSpecies} />
        ) : null}
      </Modal>
    )
  }

  handleCancel (e) {
    this.refs.editSpecies.resetFields()
    this.props.closeModel()
  }

  handleChange () {
    const fields = this.refs.editSpecies.getFieldsValue()
    console.log(fields)
  }

  handleOk () {
    const { selectId } = this.props
    this.refs.editSpecies.validateFieldsAndScroll((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values, selectId)
        this.props.actions.saveEdit(selectId, {
          name    : values.name
        })
      }
    })
  }
}

const WrappedSpeciesForm = Form.create()(React.createClass({

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
          label="种类名称"
          hasFeedback>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: '种类名称不能为空!' }
            ],
            initialValue: data.name
          })(
            <Input />
          )}
        </FormItem>
      </Form>
    )
  }
}))