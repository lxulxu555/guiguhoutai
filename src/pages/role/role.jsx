import React, {Component} from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'

import {PAGE_SIZE} from "../../utils/constants";
import {reqGetRoles,reqAddrole,reqUpdateRole} from '../../api/index'
import AddRole from './add-role'
import AuthForm from './auth-form'
import {formateData} from '../../utils/dataUtils'
import memoryUtils from "../../utils/memoryUtils";
import storageUtils from "../../utils/storageUtils";



export default class Role extends Component {

    state = {
        roles : [], //所有角色的列表
        role : {},  //选中的role
        ShowAddRole : false,
        ShowAuthForm : false
    }

    constructor(props){
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateData(create_time)
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: (auth_time) => formateData(auth_time)
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
            },
        ];
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }, // 点击行
        }
    }

    getRoles = async () => {
        const result = await reqGetRoles()
        if(result.status===0){
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    //添加角色
    addRole = () => {
        this.form.validateFields( async (err, values) => {
            if (!err) {
            this.setState({
                ShowAddRole : false
            })
            const {roleName} = values
            this.form.resetFields()

                const result = await reqAddrole(roleName)
                if(result.status===0)   {
                    message.success('添加角色成功')
                    //this.getRoles()
                    const role = result.data
                    //更新roles状态，基于原本状态数据更新
                    this.setState(state => ({
                        roles : [...state.roles,role]
                    }))
                }else{
                    message.error('添加角色失败')
                }
            }
        })
    }

    UpdateRole = async () => {
        this.setState({
            ShowAuthForm : false
        })
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        const result = await reqUpdateRole(role)
        if(result.status===0){
            //如果当前更新的是自己用户的权限，强制退出
            //  debugger
            if(role._id === memoryUtils.user.role_id){
                memoryUtils.user = {}
                storageUtils.RemoveUser()
                this.props.history.replace('/login')
                message.success('当前用户角色权限修改了，请重新登录')
            }else{
                message.success('设置角色权限成功')
                this.getRoles()
            }
        } else {
            message.error('设置角色权限失败')
        }
    }

    componentWillMount () {
        this.initColumn()
    }

    componentDidMount () {
        this.getRoles()
    }

    render() {
        const {roles,role,ShowAddRole,ShowAuthForm} = this.state
        const title = (
            <span>
                <Button type='primary' style={{marginRight:10}} onClick={() => {this.setState({
                    ShowAddRole : true
                })}}>
                    创建角色
                </Button>
                <Button type='primary' disabled = {!role._id} onClick={() => {this.setState({
                    ShowAuthForm : true
                })}}>
                    设置角色权限
                </Button>
            </span>
        )



        return (
            <div>
                <Card title={title}>
                    <Table
                        bordered
                        rowKey = '_id'
                        rowSelection={{type:'radio',
                            selectedRowKeys:[role._id],
                            onSelect : (role) => {
                                this.setState({
                                    role
                                })
                            }
                        }}
                        columns={this.columns}
                        dataSource={roles}
                        pagination={{defaultPageSize: PAGE_SIZE}}
                        onRow = {this.onRow}
                    />
                    <Modal
                        title="创建角色"
                        visible={ShowAddRole}
                        onOk={this.addRole}
                        onCancel={() => {
                            this.form.resetFields()
                            this.setState({
                            ShowAddRole : false
                        })}}
                    >
                        <AddRole
                            setForm = {(form) => {this.form = form}}
                        />
                    </Modal>
                    <Modal
                        title="设置角色权限"
                        visible={ShowAuthForm}
                        onOk={this.UpdateRole}
                        onCancel={() => {
                            this.setState({
                                ShowAuthForm : false
                            })}}
                    >
                        <AuthForm role={role} ref={this.auth}/>
                    </Modal>
                </Card>
            </div>
        )
    }
}

