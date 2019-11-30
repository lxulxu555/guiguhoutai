import React,{Component} from 'react'
import {Input,Form,Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends Component{

    static propTypes = {
        setForm : PropTypes.func.isRequired,
        roles : PropTypes.array.isRequired,
        user : PropTypes.object
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render () {

        const {roles} = this.props
        const user =  this.props.user || {}
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        }

        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} {...formItemLayout} >
                <Item label='用户名：'>
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名' }],
                        initialValue : user.username
                    })(
                        <Input
                            placeholder = '请输入用户名'
                        />,
                    )}
                </Item>
                {
                    user._id ? '' :
                        (
                            <Item label='密码：'>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }],
                                    initialValue : user.password
                                })(
                                    <Input
                                        type='password'
                                        placeholder = '请输入密码'
                                    />,
                                )}
                            </Item>
                        )
                }
                <Item label='手机号：'>
                    {getFieldDecorator('phone', {
                        rules: [{ required: true, message: '请输入手机号' }],
                        initialValue : user.phone
                    })(
                        <Input
                            placeholder = '请输入手机号'
                        />,
                    )}
                </Item>
                <Item label='邮箱：'>
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '请输入邮箱' }],
                        initialValue : user.email
                    })(
                        <Input
                            placeholder = '请输入邮箱'
                        />,
                    )}
                </Item>
                <Item label='角色：'>
                    {getFieldDecorator('role_id', {
                        rules: [{ required: true, message: '邮箱' }],
                        initialValue : user.role_id
                    })(
                        <Select>
                            {
                                roles.map((role) => (
                                    <Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Option>
                                ))
                            }
                        </Select>
                    )}
                </Item>

            </Form>
        )
    }
}

export default  Form.create()(UserForm)

