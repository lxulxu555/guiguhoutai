import React, {Component} from 'react'
import { Menu, Icon} from 'antd';
import {Link,withRouter} from 'react-router-dom'

import './left-nav.less'
import logo from './image/euraisa-logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils";

const {SubMenu} = Menu;


class LeftNav extends Component {

    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const {key,isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        if(username==='admin' || isPublic || menus.indexOf(key)!==-1){
            return true
        }else if (item.children){
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }
        return false
    }

    getMenuNodes = (menuList) => {
        const path = this.props.location.pathname
        return menuList.map(item => {

            //如果当前用户有item对应的权限，才能显示对应的菜单项
            if(this.hasAuth(item)){
                if(!item.children){
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    )
                }else{

                    const Citem = item.children.find(Citem => path.indexOf(Citem.key)===0)
                    if(Citem){
                        this.openKey = item.key
                    }
            }



                return (
                    <SubMenu key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon}/>
                                <span>{item.title}</span>
                              </span>
                        }
                    >
                        {
                            this.getMenuNodes(item.children)
                        }
                    </SubMenu>
                )
            }
        })
    }

    componentWillMount () {
       this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {

        let path = this.props.location.pathname
        if(path.indexOf('/product')===0){
            path = '/product'
        }
        const openKey = this.openKey

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt='logo'/>
                </Link>


                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    mode="inline"
                    theme="dark"
                >

                    {
                        this.menuNodes
                    }

                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)
