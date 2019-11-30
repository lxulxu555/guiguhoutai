import React, {Component} from 'react'
import {Card, Table, Button, Icon, Select, Input,message} from 'antd'

import LinkButton from '../../components/link-button/link-button'
import {resProduces,resSearchProducts,reqChangeStatus} from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

export default class ProduthHome extends Component {

    state = {
        total : 0,    //商品的总数量
        products :[], //商品的数组
        loading:false,
        searchName : '',  //搜索的内容
        searchType : 'productName',  //搜索的方式
    }

    componentWillMount () {
        this.initColumns()
    }


    componentDidMount () {
        this.getProducts(1)
    }

    //获取指定页码的列表数据显示
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({loading:true})
        let result
        const {searchType,searchName} = this.state
        //如果搜索有关键字,说明要做搜索分页
        if(searchName){
            result = await resSearchProducts({pageNum,pageSize:PAGE_SIZE,searchName,searchType})
        }else{ //一般分页请求
            result = await resProduces(pageNum,PAGE_SIZE)
        }
        this.setState({loading:false})
        if(result.status === 0){
            const {total,list} = result.data
            this.setState({
                total,
                products : list
            })
        }
    }

    ChangeStatus = async (productId,status) => {
        const result = await reqChangeStatus({productId,status})
        if(result.status===0){
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        }
    }

    AddCategory = () => {
        this.props.history.push('/product/addupdate')
    }

    //初始化表头
    initColumns = () => {
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => '￥' + price
            },
            {
                title: '状态',
                width:100,
                render : (product) => {
                    const {status,_id} = product
                    console.log(product)
                    const newStatus = status===1 ? 2 : 1
                    return (
                        <span>
                            <Button
                                type='primary'
                                onClick={() => this.ChangeStatus(_id,newStatus)}
                            >
                                {status === 1 ? '下架' : '上架' }
                            </Button>
                            <span>{status===1 ?'在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                title: '操作',
                width:100,
                render : (product) => {
                    return (
                    <span>
                        <LinkButton onClick={() => this.props.history.push('/product/detail',{product})}>详情</LinkButton>
                        <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                    </span>
                    )
                }
            },
        ];
    }
    render() {

        const {products,total,loading,searchName,searchType} = this.state

        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{width:150}}
                    onChange={value => this.setState({searchType:value})}
                >
                    <Option value='productName'>按名称搜索</Option>
                    <Option value='productDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='关键字'
                    style={{width:150,margin: "0 15px"}}
                    value={searchName}
                    onChange={event => this.setState({searchName:event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
            </span>
        )

        const extra = (
            <Button type='primary' onClick={this.AddCategory}>
                <Icon type='plus'/>
                添加商品
            </Button>
        )




        return (
            <div style={{background: '#ECECEC'}}>
                <Card title={title} extra={extra} bordered={false}>
                    <Table
                        rowkey='_id'
                        columns={this.columns}
                        dataSource={products}
                        bordered
                        loading={loading}
                        pagination={{
                            current : this.pageNum,
                            defaultPageSize:PAGE_SIZE,
                            showQuickJumper:true,
                            total,
                            onChange:this.getProducts,
                        }}
                    />
                </Card>
            </div>
        )
    }
}

