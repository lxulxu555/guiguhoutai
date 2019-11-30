import React,{Component} from 'react'
import {
    Form,
    Icon,
    Input,
    Button,
    message
} from 'antd';
import {Redirect} from 'react-router-dom'

import './login.less'
import logo from './images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'

class Login extends Component{


    handleSubmit = (event) => {
        event.preventDefault()
        const {form} = this.props
        form.validateFields(async (err, values) => {
            if (!err) {
                const {username,password} = values
                const result = await reqLogin(username,password)
                if(result.status===0){
                    message.success('登陆成功')
                    const user = result.data
                    memoryUtils.user = user
                    storageUtils.SaveUser(user)
                    this.props.history.replace('/')
                }else{
                    message.error(result.msg)
                }
            }
        });
    }

    render () {

        const { getFieldDecorator } = this.props.form;
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/'/>
        }
        return (
            <div className="login">
                <div className="login-header">
                    <img src={logo} alt='logo'/>
                </div>
                <div className="login-content">
                    <h2>Eurasia点播系统</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                         <Form.Item>
                             {
                                 getFieldDecorator('username',{
                                     initialValue:'admin',
                                     rules : [
                                         {required:true,whiteSpace:true,message:'用户名必须输入'},
                                         {min:4,message:'用户名最少为4位'},
                                         {max:12,message:'用户名最多为12位'},
                                         {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是英文数字和下划线组成'}
                                     ]
                                 })(
                                     <Input
                                         prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                         placeholder="Username"
                                     />,
                                 )
                             }
                        </Form.Item>

                        <Form.Item>
                            {
                                getFieldDecorator('password',{
                                    rules: [
                                        {required: true,whiteSpace: true,message:'密码必须输入'},
                                        {min:4,message:'密码最少为四位'},
                                        {max:12,message:'密码最多为十二位'},
                                        {pattern: /^[a-zA-Z0-9_]+$/,message:'密码必须是英文字母数字下划线组成'}
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="Password"
                                    />,
                                )
                            }
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>

                    </Form>
                </div>
            </div>
        )
    }
}

const WrapLogin = Form.create()(Login)
export default WrapLogin

