import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import './header.less'
import {formateData} from '../../utils/dataUtils'
import {reqWeather} from '../../api/index'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'
import LinkButton from '../link-button/link-button'

class Header extends Component {

    state = {
        currentTime : formateData(Date.now()),
        dayPictureUrl : '',
        weather : '',
        temperature : ''
    }

    //更新时间
    getTime = () => {
        this.intervalId = setInterval(() => {
            const currentTime = formateData(Date.now())
            this.setState({currentTime})
        },1000)
    }

    //更新天气和图片
    getWeather = async () => {
        const {dayPictureUrl, weather,temperature} = await reqWeather('西安')
        this.setState({dayPictureUrl,weather,temperature})
    }

    //获取当前路由的标题
    getTitle = () => {
        let title
        const path = this.props.location.pathname
        menuList.forEach(item=> {
            if(item.key===path){
                title = item.title
            }else if(item.children){
                const Citem = item.children.find(Citem => path.indexOf(Citem.key)===0)
                if (Citem){
                    title = Citem.title
                }
            }
        })
        return title
    }

    //退出登录
    LoginOut = () => {
        Modal.confirm ({
            title: '确认退出吗',
            onOk :() => {
                console.log('ok',this);
                storageUtils.RemoveUser()
                memoryUtils.user = {}
                this.props.history.replace('/login')
            },
        })
    }

    componentDidMount () {
        this.getTime()
        this.getWeather()
    }

    //清除定时器
    componentWillUnmount () {
        clearInterval(this.intervalId)
    }

    render () {

        const {currentTime,dayPictureUrl,weather,temperature} = this.state
        const username = memoryUtils.user.username
        const title = this.getTitle()

        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎,{username}</span>
                    <LinkButton  href='#' onClick={this.LoginOut}>退出</LinkButton>
                </div>
                <div className='header-bottom'>
                    <div className='header-bottom-left'>
                    <span>{title}</span>
                    </div>
                    <div className='header-bottom-right'>
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt='weather'/>
                    <span>{weather}</span>
                    <span>{temperature}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)

