import React,{Component} from 'react'
import {Card, Table, Button, Modal,message} from 'antd'
import LinkButton from "../../components/link-button/link-button";


import {PAGE_SIZE} from "../../utils/constants";
import {formateData} from "../../utils/dataUtils";
import {reqGetUsers,reqDeleteUser,reqAddOrUpdateUser} from '../../api/index'
import UserForm from './user-form'

export default class User extends Component{

    state = {
        users : [], //所有用户列表
        roles : [],  //所有角色列表
        isShow :false,
    }

    getUsers = async () => {
        const result = await reqGetUsers()
        if(result.status===0){
            const {users,roles} = result.data
            this.initRoleNames(roles)
            this.setState({
                users,
                roles
            })
        }
    }

    AddorUpdateUser =  () => {
        this.form.validateFields( async (err,values) => {
            if(!err){
                this.setState({
                    isShow : false
                })
                const user = values
                this.form.resetFields()
                //如果是更新，需要给user指定_id属性
                if(this.user){
                    user._id = this.user._id
                }

                const result = await reqAddOrUpdateUser(user)

                if(result.status===0){
                    message.success(`${this.user ? '修改' : '添加   '}用户成功`)
                    this.getUsers()
                }
            }
        })

    }

    deleteUsers =  (user) => {
         Modal.confirm ({
            title: `确认删除${user.username}吗？`,
            content: 'Some descriptions',
            onOk : async () => {
                const result = await reqDeleteUser(user._id)
                if(result.status===0){
                    message.success(`删除${user.username}用户成功`)
                    this.getUsers()
                }
            },
        })

    }

    //根据role的数组，生成包含所有角色名的对象（属性名用角色id值）
    initRoleNames = (roles) => {
        const roleNmaes = roles.reduce((pre,role) => {
            pre [role._id] = role.name
            return pre
        },{})
        //保存
        this.roleNames = roleNmaes
    }

    //显示修改页面
    showUpdate = (user) => {
        this.user = user   //保存user
        this.setState({
            isShow :true
        })
    }

    showAdd = () => {
        this.user = null
        this.setState({
            isShow : true
        })
    }

    initColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
            },
            {
                title: '邮箱',
                dataIndex: 'email',
            },
            {
                title: '电话',
                dataIndex: 'phone',
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render : formateData
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                render : (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUsers(user)}>删除</LinkButton>
                    </span>
                )
            },
        ];
    }

    componentWillMount () {
        this.initColumns()
    }

    componentDidMount () {
        this.getUsers()
    }

    render () {
        const title = (
            <Button type='primary' onClick={this.showAdd}>创建用户</Button>
        )

        const {isShow,users,roles} = this.state
        const user = this.user || {}
        return (
            <Card title={title}>
                <Table
                    bordered
                    rowKey = '_id'
                    columns={this.columns}
                    dataSource={users}
                    pagination={{defaultPageSize: PAGE_SIZE}}
                    onRow = {this.onRow}
                />
                <Modal
                    title={
                        user._id ? "修改用户" : "添加用户"
                    }
                    visible={isShow}
                    onOk={this.AddorUpdateUser}
                    onCancel={() => {
                        this.form.resetFields()
                        this.setState({
                            isShow : false
                        })}}
                >
                    <UserForm
                        setForm = {(form) => {this.form = form}}
                        roles = {roles}
                        user = {user}
                    />
                </Modal>
            </Card>
        )
    }
}

