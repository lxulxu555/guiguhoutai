import React,{Component} from 'react'
import { Upload, Icon, Modal,message } from 'antd';
import PropTypes from 'prop-types'

import {reqDeleteImage} from '../../api/index'
import {BASE_IMG_URL, SERVER_IMG_URL} from '../../utils/constants'


function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

export class PicturesWall extends React.Component {

    static propTypes = {
        imgs : PropTypes.array
    }


    state = {
        previewVisible: false,
        previewImage: '',
        fileList : [],
    };

    constructor(props){
        super(props);
        let fileList = []
        //如果传入了img属性
        const {imgs} = this.props
        if(imgs && imgs.length > 0){
            fileList = imgs.map((img, index) => ({
                uid: -index, // 每个file都有自己唯一的id
                name: img, // 图片文件名
                status: 'done', // 图片状态: done-已上传, uploading: 正在上传中, removed: 已删除
                url: SERVER_IMG_URL + img
            }))
        }

        //初始化状态
        this.state = {
            previewVisible: false,
            previewImage: '',
            fileList
        };
    }


    //获取所有已上传图片文件名的数组
    GetImgs = () => {
        return this.state.fileList.map(Item => Item.name)
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    /*
    file:当前操作的图片文件
    fileList:所有已上传图片文件对象的数组
     */
    handleChange = async ({ fileList,file }) => {

        //一旦上传成功，将当前上传的file的信息修正(name,url)
        if(file.status==='done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功')
                const {name, url} = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        }else if(file.status==='removed'){
            const result = await reqDeleteImage(file.name)
            if(result.status===0){
                message.success('删除成功')
            }else{
                message.error('删除失败')
            }
        }
        //在操作(上传/删除)过程中更新fileList状态
        this.setState({ fileList });
    }

    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div>Upload</div>
            </div>
        );
        return (
            <div className="clearfix">
                <Upload
                    action="/manage/img/upload"
                    listType="picture-card"
                    name='image'
                    accept='image/*'
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        );
    }
}

