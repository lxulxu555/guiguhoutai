import React, {Component} from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddCategory extends Component {

    static propTypes = {
        parentId: PropTypes.string.isRequired,
        categorys: PropTypes.array.isRequired,
        setForm : PropTypes.func.isRequired
    }




    componentWillMount () {
        this.props.setForm(this.props.form)
    }

    render() {
        const {getFieldDecorator} = this.props.form
        const {parentId,categorys} = this.props
        return (
            <div>
                <Form>
                    <Item>
                            {getFieldDecorator('parentId', {
                                initialValue: parentId,
                                rules: [{required: true, message: '不能为空'}],
                            }
                        )
                        (
                            <Select>
                                <Option value='0'>一级分类</Option>
                                {
                                    categorys.map(Item => <Option value={Item._id}>{Item.name}</Option>)
                                }
                            </Select>
                        )}
                    </Item>
                    <Item>
                        {getFieldDecorator('categoryName', {
                            initialValue: '',
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <Input placeholder='请输入分类名称'/>
                        )}
                    </Item>
                </Form>
            </div>
        )
    }
}

export default Form.create()(AddCategory)

