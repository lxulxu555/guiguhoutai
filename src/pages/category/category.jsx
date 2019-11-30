import React, {Component} from 'react'
import {Card, Button, Icon, Table, message, Modal,Form} from 'antd'

import LinkButton from '../../components/link-button/link-button'
import {reqAddCategory, reqUpdateCategory, resList} from '../../api/index'
import AddCategory from './add-category'
import UpdateCategory from './update-category'

export default class Category extends Component {

    state = {
        categorys: [],
        subCategorys: [],
        loading: false,
        parentId: '0',
        parentName: '',
        showStatus : 0
    }

    //分类
    getCategorys = async (parentId) => {
        //在发请求前
        this.setState({loading: true})
        parentId = parentId || this.state.parentId
        const result = await resList(parentId)
        //在发请求后
        this.setState({loading: false})
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                this.setState({categorys})
            } else {
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error('获取列表失败')
        }
    }

    //查看子分类
    ViewSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            //获取二级分类列表
            this.getCategorys()
        })
    }

    //  返回一级分类
    ViewCategorys = () => {
        this.setState({
            parentId : '0',
            parentName : '',
            subCategorys : []
        })
    }

    componentWillMount() {
        this.initColumns()
    }


    componentDidMount() {
        this.getCategorys()
    }

    ShowAdd = () => {
        this.setState({
            showStatus : 1
        })
    }

    ShowUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus : 2
        })
    }

    handleCancel = () => {
        this.form.resetFields()
        this.setState({
            showStatus : 0
        })
    }

    UpadteCategorys =  () => {
        this.form.validateFields(async(err,values) => {
            if(!err){
                //隐藏确定框
                this.setState({
                    showStatus : 0
                })
                const categoryId = this.category._id
                const categoryName = values.categoryName
                this.form.resetFields()
                //发请求更新分类
                const result = await reqUpdateCategory(categoryId,categoryName)
                if(result.status===0){
                    //重新获取分类列表
                    this.getCategorys()
                }
            }
        })
    }

    AddCategory =  () => {
        this.form.validateFields(async (err,values) => {
            if(!err){
                //隐藏确定框
                this.setState({
                    showStatus : 0
                })
                const {parentId,categoryName} = values
                this.form.resetFields()
                const result = await reqAddCategory(parentId,categoryName)
                if(result.status===0){
                    if(parentId===this.state.parentId){
                        //重新获取分类列表
                        this.getCategorys()
                    }else if (parentId==='0'){
                        this.getCategorys('0')
                    }
                }
            }
        })
    }

    //表头
    initColumns = () => {
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.ShowUpdate(category)}>修改分类</LinkButton>
                        {
                            this.state.parentId === '0' ?
                                //设置点击时才调用函数,否则就是一渲染就会调
                                <LinkButton onClick={() => this.ViewSubCategorys(category)}>查看子分类</LinkButton>
                                : ''
                        }
                    </span>
                )
            },
        ];
    }


    render() {
        const {categorys, loading, parentId, subCategorys, parentName} = this.state
        const category = this.category || {}  //如果还没有指定空对象

        const title = parentId === '0' ? "一级分类列表" : (
            <span>
                <LinkButton onClick={this.ViewCategorys}>一级分类类表</LinkButton>
                <Icon type='arrow-right' style={{marginRight:10}}/>
                <span>{parentName}</span>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={this.ShowAdd}>
                <Icon type='plus'/>
                添加
            </Button>
        )

        return (
            <div style={{background: '#ECECEC'}}>
                <Card title={title} extra={extra} bordered={false}>
                    <Table
                        dataSource={parentId === '0' ? categorys : subCategorys}
                        columns={this.columns}
                        bordered
                        rowKey='_id'
                        pagination={{defaultPageSize: 4, showQuickJumper: true}}
                        loading={loading}
                    />
                </Card>
                <Modal
                    title="添加分类"
                    visible={this.state.showStatus===1}
                    onOk={this.AddCategory}
                    onCancel={this.handleCancel}
                >
                    <AddCategory
                        categorys = {categorys}
                        parentId = {parentId}
                        setForm={(form) => {this.form=form}}
                    />
                </Modal>
                <Modal
                    title="修改分类"
                    visible={this.state.showStatus===2}
                    onOk={this.UpadteCategorys}
                    onCancel={this.handleCancel}
                >
                    <UpdateCategory
                        categoryName={category.name}
                        setForm={(form) => {this.form=form}}
                    />
                </Modal>
            </div>
        )
    }
}

