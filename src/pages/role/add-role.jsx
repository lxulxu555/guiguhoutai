import React,{Component} from 'react'
import {Input,Form} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class AddRole extends Component{

    static propTypes = {
        setForm : PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render () {
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        }

        const { getFieldDecorator } = this.props.form;

        return (
            <Form onSubmit={this.handleSubmit} {...formItemLayout} >
                <Item label='角色名称'>
                    {getFieldDecorator('roleName', {
                        rules: [{ required: true, message: '请输入角色名' }],
                    })(
                        <Input
                            placeholder = '请输入角色名称'
                        />,
                    )}
                </Item>
            </Form>
        )
    }
}

export default  Form.create()(AddRole)

