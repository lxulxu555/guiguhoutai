import React, {Component} from 'react'
import {List, Card, Icon} from 'antd'

import LinkButton from '../../components/link-button/link-button'
import {resListID} from '../../api/index'
import {BASE_IMG_URL, SERVER_IMG_URL} from '../../utils/constants'


const Item = List.Item

export default class ProductDetail extends Component {

    state = {
        cName1: '', //一级分类名称
        cName2: ''  //二级分类名称
    }

    //根据分类ID获取分类
    async componentDidMount() {
        const {categoryId, pCategoryId} = this.props.location.state.product
        if (pCategoryId === '0') { //获取一级分类
            const result = await resListID(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            //为了效率高，不让他们同步执行，所以一次性发送多个请求，成功了才正常处理
            const results = await Promise.all([resListID(pCategoryId), resListID(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            /*const result1 = await resListID(pCategoryId) //获取一级分类
            const result2 = await resListID(categoryId)  //获取二级分类
            const cName1 = result1.data.name
            const cName2 = result2.data.name*/
            this.setState({
                cName1,
                cName2
            })
        }
    }

    render() {
        const {name, desc, price, detail, imgs} = this.props.location.state.product
        const {cName1, cName2} = this.state
        const title = (
            <span>
                <LinkButton>
                    <Icon
                        type='arrow-left'
                        style={{fontSize: 20, marginRight: 10}}
                        onClick={() => this.props.history.goBack()}
                    />
                </LinkButton>
                <span>商品详情</span>
            </span>
        )

        return (
            <div style={{background: '#ECECEC'}}>
                <Card title={title} className='Product-detail'>
                    <List>
                        <Item>
                            <span className='Product-Detail-left'>球员名称：</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className='Product-Detail-left'>球员描述：</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className='Product-Detail-left'>球员价格：</span>
                            <span>{price}</span>
                        </Item>
                        <Item>
                            <span className='Product-Detail-left'>所属分类：</span>
                            <span>{cName1} {cName2 ? '--->' + cName2 : ''}</span>
                        </Item>
                        <Item>
                            <span className='Product-Detail-left'>球员图片：</span>
                            <span>
                                  {
                                      imgs.map(img => (
                                          <img
                                              key={img}
                                              src={SERVER_IMG_URL + img}
                                              className="Product-Detail-image"
                                              alt="img"
                                          />
                                      ))
                                  }
                             </span>
                        </Item>
                        <Item>
                            <span className="Product-Detail-left">商品详情:</span>
                            <span dangerouslySetInnerHTML={{__html: detail}}/>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}

