import React, {Component} from 'react'
import {
    Tree,
    Input,
    Form
} from 'antd'
import PropTypes from 'prop-types'

import menuConfig from '../../config/menuConfig'

const Item = Form.Item
const {TreeNode} = Tree;

export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object,
    }


    //根据传入角色的menus生成初始状态
    constructor(props) {
        super(props)
        const {menus} = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getTreeNodes = (menuConfig) => {
        return menuConfig.reduce((pre, Item) => {
            pre.push(
                <TreeNode title={Item.title} key={Item.key}>
                    {Item.children ? this.getTreeNodes(Item.children) : ''}
                </TreeNode>
            )
            return pre
        }, [])
    }

    onCheck = (checkedKeys) => {
        this.setState({
            checkedKeys
        })
    }

    //为父组件获取最新menus的方法
    getMenus = () => this.state.checkedKeys

    componentWillMount() {
        this.TreeNodes = this.getTreeNodes(menuConfig)
    }

    //根据新传入的role来更新checkKeys的状态
    /*
    当组件接收到新的属性时自动调用
    */
    componentWillReceiveProps (nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys : menus
        })
    }

    render() {
        const {role} = this.props
        const {checkedKeys} = this.state
        const formItemLayout = {
            labelCol: {span: 4},
            wrapperCol: {span: 17},
        }
        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled/>
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    {this.TreeNodes}
                </Tree>
            </div>
        )
    }
}

