import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router'
import { Breadcrumb, Form, Icon, Input, Button, Select, message } from 'antd'
import { CoreLayout } from '../layouts'
import * as actions from './action'
//import '../styles/passport.scss'
const FormItem = Form.Item
const Option = Select.Option

@connect(
  state => ({
    auth: state.passport.auth
  }),
  dispatch => ({
    actions: bindActionCreators({...actions}, dispatch)
  })
)
export default class BaseInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      
    }
  }

  render () {
    const { auth } = this.props
    const setting = {
      pageCode: '8001',
      auth
    }
    return (
      <CoreLayout {...setting}>
        {this.renderHeader()}
        <WrappedBaseInfoForm 
          ref={'baseInfo'}
          data={auth}
          handleSubmit={this.handleSubmit.bind(this)} />
      </CoreLayout>
    )
  }

  renderHeader () {
    return (
      <Breadcrumb>
        <Breadcrumb.Item><Link to={`/`}>{'主页'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item><Link to={`/user`}>{'用户中心'}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{'基本信息'}</Breadcrumb.Item>
      </Breadcrumb>
    )
  }

  handleSubmit () {
    this.refs.baseInfo.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values)
        //this.props.actions.editpwd(values.password)
      }
    })
  }

}

const WrappedBaseInfoForm = Form.create()(React.createClass({

  render () {
    const { getFieldDecorator } = this.props.form
    const { data } = this.props
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
          label="用户名"
          hasFeedback>
          {getFieldDecorator('username', {
            rules: [
              
            ],
            initialValue: data.username
          })(
            <Input disabled />
          )}
        </FormItem>

        <FormItem
          {...formItemLayout}
          label="管理组"
          hasFeedback>
          {getFieldDecorator('group', {
            rules: [
              
            ],
            initialValue: data.group.gid
          })(
            <Select style={{ width: 200 }} placeholder="请选择管理组" disabled>
              <Option value={data.group.gid}>{data.group.name}[{data.group.level}]</Option>
            </Select>
          )}
        </FormItem>
        {/*<FormItem {...tailFormItemLayout}>
          <Button type="primary" onClick={this.props.handleSubmit} size="large">确认修改</Button>
        </FormItem>*/}
      </Form>
    )
  }
}))