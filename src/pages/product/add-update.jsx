import React, {Component} from 'react'
import {
    Card,
    Icon,
    Input,
    Button,
    Form,
    Cascader,
    message
} from 'antd'
import {resList,reqAddOrUpdateProduct} from '../../api/index'

import LinkButton from '../../components/link-button/link-button'
import {PicturesWall} from './picture-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const {TextArea} = Input


class ProduchAddUpdate extends Component {

    state = {
        options : []
    };

    constructor(props){
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields(async (error, values) => {
            if (!error) {
                //1、收集数据
                const {name, desc, price, CategoryIds} = values
                let pCategoryId,categoryId
                if(CategoryIds.length===1){
                    pCategoryId = '0'
                    categoryId = CategoryIds[0]
                } else {
                    pCategoryId = CategoryIds[0]
                    categoryId = CategoryIds[1]
                }
                const imgs = this.pw.current.GetImgs()
                const detail = this.editor.current.GetDetail()
                const product = {name,desc,price,imgs,detail,pCategoryId,categoryId}
                //如果是更新，需要添加_id
                if(this.isUpdate){
                    product._id = this.product._id
                }
                //2、调用接口请求函数去添加/更新
                const result = await reqAddOrUpdateProduct(product)
                //3、根据结果提示
                if(result.status===0){
                    message.success(`${this.isUpdate ? '修改' : '添加' }商品成功`)
                    this.props.history.goBack()
                }else{
                    message.error(`${this.isUpdate ? '修改' : '添加' }商品失败`)
                }
            }
        })
    }

    validatorPrice = (rule, value, callback) => {
        if(value>0){
            callback()
        }else{
            callback('价格必须大于0')
        }
    }

    getCategorys = async (parentId) => {
        //debugger
        const result = await resList(parentId)
        if(result.status===0){
            const categorys = result.data
            if(parentId==='0'){ //如果是一级分类列表
                this.InitOptions(categorys)
            } else{  //如果是二级分类列表
                return categorys  //返回二级列表 ==> 当前async函数返回的promise对象成功，且value为categorys
            }
        }
    }

    InitOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.map(Item  => ({
            value: Item._id,
            label: Item.name,
            isLeaf: false,
        }))


        //如果是一个二级分类商品的更新
        const {isUpdate,product} = this
        const {pCategoryId,categoryId} = product
        if(isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const SubCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表的options
            const ChildOptions = SubCategorys.map(Item => ({
                value: Item._id,
                label: Item.name,
                isLeaf: true,
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联到对应的一级option上
            targetOption.children = ChildOptions
        }

        //更新options状态
        this.setState({
            options
        })
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        targetOption.loading = true;
        //根据选中的分类，请求获取二级分类列表
        const SubCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false;
        if(SubCategorys && SubCategorys.length > 0){
            //生成一个二级列表的options
            const ChildOptions = SubCategorys.map(Item => ({
                value: Item._id,
                label: Item.name,
                isLeaf: true,
            }))
            //关联到当前的option上
            targetOption.children = ChildOptions
        }else{ //当前选中的分类没有二级分类
            targetOption.isLeaf = true
        }
        //更新option的状态
        this.setState({
            options : [...this.state.options]
        })
    };

    onChange = (value, selectedOptions) => {
        console.log(value, selectedOptions);
    }



    componentDidMount () {
        this.getCategorys('0')
    }

    componentWillMount () {
        //取出携带的state
        const product = this.props.location.state
        //保存是否是更新的标识
        this.isUpdate = !!product  //强制转换为布尔类型，也就是为true
        this.product = product || {}
    }


    render() {
        const {getFieldDecorator} = this.props.form
        const {isUpdate,product} = this
        const {pCategoryId,categoryId,imgs} = product
        const CategoryIds = []

        if(isUpdate){
            if(categoryId === '0'){
                CategoryIds.push(categoryId)
            }else{
                CategoryIds.push(pCategoryId)
                CategoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
            <LinkButton onClick={() => this.props.history.goBack()}>
                <Icon type='arrow-left' style={{fontSize: 20, marginRight: 5}}/>
            </LinkButton>
            <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )

        const formItemLayout = {
            labelCol: {span: 2},
            wrapperCol: {span: 8},
        }


        return (
            <div>
                <Card title={title} bordered={false}>
                    <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                        <Item label='商品名称：'>
                            {
                                getFieldDecorator('name', {
                                    initialValue: product.name,
                                    rules: [
                                        {required: true, message: '商品名称必须输入'},
                                    ],
                                })(
                                    <Input placeholder='请输入商品名称'/>
                                )
                            }
                        </Item>
                        <Item label='商品描述'>
                            {
                                getFieldDecorator('desc', {
                                    initialValue: product.desc,
                                    rules: [
                                        {required: true, message: '商品描述必须输入'},
                                    ],
                                })(
                                    <TextArea placeholder='请输入商品描述'/>
                                )
                            }
                        </Item>
                        <Item label='商品价格'>
                            {
                                getFieldDecorator('price', {
                                    initialValue: product.price,
                                    rules: [
                                        {required: true, message: '商品价格必须输入'},
                                        {validator : this.validatorPrice}
                                    ],
                                })(
                                    <Input type='number' placeholder='请输入商品价格' addonAfter='元'/>
                                )
                            }
                        </Item>
                        <Item label='商品分类'>
                            {
                                getFieldDecorator('CategoryIds', {
                                    initialValue: CategoryIds,
                                    rules: [
                                        {required: true, message: '商品分类必须指定'},
                                    ],
                                })(
                                    <Cascader
                                        options={this.state.options}
                                        loadData={this.loadData}
                                        onChange={this.onChange}
                                        changeOnSelect
                                    />
                                )
                            }
                        </Item>
                        <Item label='商品图片'>
                            <PicturesWall ref={this.pw} imgs={imgs}/>
                        </Item>
                        <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                            <RichTextEditor ref={this.editor}/>
                        </Item>
                        <Item>
                            <Button type='primary'  htmlType="submit">
                                添加
                            </Button>
                        </Item>
                    </Form>
                </Card>
            </div>
        )
    }
}

export default Form.create()(ProduchAddUpdate)

/*
1、子组件调用父组件的方法：将父组件的方法以函数属性 形式传递给子组件，子组件就可以调用
2、父组件调用子组件的方法：在父组件中通过ref得到子组件标签对象，调用其方法
*/

