import React,{Component} from 'react'
import {Switch,Route,Redirect} from 'react-router-dom'

import ProduthHome from './home'
import ProduchAddUpdate from './add-update'
import ProductDetail from './detail'
import  './product.less'

export default class Product extends Component{
    render () {
        return (
            <div>
                <Switch>
                    <Route path='/product' component={ProduthHome} exact/>
                    <Route path='/product/addupdate' component={ProduchAddUpdate}/>
                    <Route path='/product/detail' component={ProductDetail}/>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        )
    }
}

