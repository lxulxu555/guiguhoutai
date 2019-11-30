import jsonp from 'jsonp'
import {message} from 'antd'

import ajax from './ajax'


//登录
export const reqLogin = (username, password) => ajax('/login', {username, password}, 'POST')


//获取天气
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // 发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp()', err, data)
            // 如果成功了
            if (!err && data.status==='success') {
                // 取出需要的数据
                const {dayPictureUrl, weather,temperature} = data.results[0].weather_data[0]
                resolve({dayPictureUrl, weather,temperature})
            } else {
                // 如果失败了
                message.error('获取天气信息失败!')
            }

        })
    })
}

//添加分类
export const reqAddCategory = (parentId,categoryName) =>ajax('/manage/category/add',{parentId,categoryName},'POST')

//更新分类
export const reqUpdateCategory = (categoryId,categoryName) => ajax('/manage/category/update',{categoryId,categoryName},'POST')

//获取分类列表
export const resList = (parentId) => ajax('/manage/category/list',{parentId})

//获取商品分页列表
export const resProduces = (pageNum,pageSize) => ajax('/manage/product/list',{pageNum,pageSize})

/*根据ID/Name搜索产品分页列表
* searchType:搜索的类型，productName/productDesc*/
export const resSearchProducts = ({pageNum,pageSize,searchName,searchType}) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType] : searchName,
})

//根据分类ID获取分类
export const resListID = (categoryId) => ajax('/manage/category/info',{categoryId})

//对商品进行上架/下架处理
export const reqChangeStatus = ({productId,status}) => ajax('/manage/product/updateStatus',{productId,status},'POST')

//删除图片
export const reqDeleteImage = (name) => ajax('/manage/img/delete',{name},'POST')

//添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax('/manage/product/' + (product._id ? 'update':'add'),product,'POST')

//获取角色列表
export const reqGetRoles = () => ajax('/manage/role/list')

//添加角色
export const reqAddrole = (roleName) => ajax('/manage/role/add',{roleName},'POST')

//更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')

//获取所有用户列表
export const reqGetUsers = () => ajax('/manage/user/list')

//删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')

//添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax('/manage/user/' + (user._id ? 'update' : 'add'),user,'POST')
