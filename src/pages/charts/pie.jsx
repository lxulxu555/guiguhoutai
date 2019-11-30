import React,{Component} from 'react'
import {Card,Button} from 'antd'
import ReactEcharts from 'echarts-for-react'

export default class Bar extends Component{

    state = {
        a : 200,
        b : 300,
        c : 280,
        d : 310,
        e : 200,
    }

    Update = () => {
        this.setState(state => ({
            a : this.state.a+1,
            b : this.state.b-1,
            c : this.state.c+1,
            d : this.state.d-1,
            e : this.state.e+1,
        }))
    }

    getOption = (a,b,c,d,e) => {
        return {
                backgroundColor: '#2c343c',

                title: {
                    text: 'Customized Pie',
                    left: 'center',
                    top: 20,
                    textStyle: {
                        color: '#ccc'
                    }
                },

                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },

                visualMap: {
                    show: false,
                    min: 80,
                    max: 600,
                    inRange: {
                        colorLightness: [0, 1]
                    }
                },
                series : [
                    {
                        name:'访问来源',
                        type:'pie',
                        radius : '55%',
                        center: ['50%', '50%'],
                        data:[
                            {value:a, name:'直接访问'},
                            {value:b, name:'邮件营销'},
                            {value:c, name:'联盟广告'},
                            {value:d, name:'视频广告'},
                            {value:e, name:'搜索引擎'}
                        ].sort(function (a, b) { return a.value - b.value; }),
                        roseType: 'radius',
                        label: {
                            normal: {
                                textStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                lineStyle: {
                                    color: 'rgba(255, 255, 255, 0.3)'
                                },
                                smooth: 0.2,
                                length: 10,
                                length2: 20
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#c23531',
                                shadowBlur: 200,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },

                        animationType: 'scale',
                        animationEasing: 'elasticOut',
                        animationDelay: function (idx) {
                            return Math.random() * 200;
                        }
                    }
                ]
            };
        }

    render () {
        const {a,b,c,d,e} = this.state
        return (
            <div>
                <Card>
                    <Button type='primary' onClick={this.Update}>更新</Button>
                </Card>
                <Card title='柱状图1'>
                    <ReactEcharts option={this.getOption(a,b,c,d,e)}/>
                </Card>
            </div>
        )
    }
}

