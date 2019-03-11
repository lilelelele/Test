<template>
    <div class="my-photo">
        <x-header :right-options="{showMore: true}" @on-click-more="showMenus = true">个人头像</x-header>

        <div class="curr-photo" @click="getPosition">
            <img v-if="photo" :src="photo" />
        </div>

        <div class="croppa-layout" v-if="base64">
            <croppa class="croppa-comment" v-model="croppa" :width="screenWidth" :height="screenWidth" :initial-image="base64" :show-remove-button="false" prevent-white-space>
                <span class="reference reference1" />
                <span class="reference reference2" />
                <span class="reference reference3" />
                <span class="reference reference4" />
            </croppa>

            <div class="action-footer">
                <span @click="base64 = ''">取消</span>
                <span class="rotate-btn" @click="croppa.rotate()" />
                <span @click="croppaConfirm">完成</span>
            </div>
        </div>

        <div v-transfer-dom>
			<actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="menuClick"></actionsheet>
		</div>

        <loading v-if="loading" :show="true" text="请稍后..." />
    </div>
</template>

<script>
    import { XHeader, Actionsheet, TransferDom, Loading } from 'vux'
    import env from '../../other/env'
    
    export default {
        directives: { TransferDom },
        components: { XHeader, Actionsheet, Loading },
        data (){
            return {
                loading: false,

                // 屏幕宽度
                screenWidth: window.screen.width,

                // 用户的最终头像
                photo: '',

                // 拍照或从相册选择的图片base编码
                base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFH0lEQVR4Xu2bj3EVNxDGdysIVBCoAFxBSAVJKghUgKkgUEFCBYEKSCogVABUAFSAXcEyP8/ejJBXd9JJ8nsZP814bI/v6Xa//fftSla55Utvuf5yAuDkAbccgVMI3HIHOEwSNLOHIvKjiPB9WfdE5LP/ciEiH0Tko6ry87R1IyFgZndE5BcR+VVEHokIv9cugPhPRF6rKj8PXVMBMDOs+oeIPB4kNQD8paqvB+03JwQmKJ7rS6g8U9V/eoEY7gFm9lREnje6OXq8E5GfGhUiNJ6o6pI7Gj8u4zzA4/yNx/iaIB9FBMsh/IcoyfleJEjyBXnjwcqGJElA2OUNQzzAszrKE/PRuiR2PX6bs7qHFHnkXER+KLzjXFVftrpANwCu/NuCy6M44fBqRDlzzwAEEmu0eM+TFhC6AHDLvC8oT0w/7onPkiIO+qtCaLxQVUCvWrsBcGtg+ZTMLC9tEqJK0uwhfz9h9XvweXICAG2uHgCIeRJUvqpfvildxQNmhqI5COSZn2uI0y4AzAzFAeCgyi8vL4BAhTnbwrAZAHe9T0Hcv1RVEtRBlplRVnMeAVkiTIprDwAkmDwL07REueDGwHDDQIjSMkko3F+rQE0AFKxPqXtUE2+z0SiE5mpCbgUgsj5d2qhmpxujIBQuVPVuaeNWAIj9nO3hYru5eLfG18sj9JnynK5iZaoGwMkHpCddR2X9pCrQNqf9w7+qGpXs+mbIzCL3p9aSfY9qmRkh+XcqlKqGxm7xgLzMXKpqy2QnBMnpNOOxq5GYqkKhu5bvSbimKzRWCwCWbVh0qxrpvaJQTnPuQD4hZrs8y8zyMAirQQiAmeV1HkvngiLgd0Kq6osa5XnGzMgna9zht709vu+fU+SQqJUAgD0x2WlZ1UywkE/yd22SmDXhgne8U1UqxHerBAAWz1nV2vsgQ/dqe34z+1o5MtvdWAWkqB4Ad6FrmXQFgWp3LSSo0tbVXpVvYGY5H2gDwEGIGoz8XeHGJY3+bwCQpHLyk+vWzATNjPguzfbS/XtCoN8D3AsiArQIuWvyU5kEm/JKEAK53O0h4ACQEKmpkJV0faGM1Sa+QMC8TuePVOeVKNzMLK9k9WUwEDaaAPUKCLBYKS+3AMswtZcI5fmrnggVEE03bEp8G/UaCrx8McYacgBqZjlz7abCCAm/JjZx/aNpgWs8trsZShKitMzd16w/629mxjEZx/HL6m+HZwk7et8Cz+gfiIwWdNZ+wYh8tW2vbodnCTxy34L1xw1FRwo7Yy8zYxaYdnybZKrLA3yoQR1nVsAhRNV53CTlI8Y6/mBkEd7MOI/jpemU+GxUHW8BKZoB+g2zzcOa3R7QeyjZouAGkULJ/H5C9WHNbgCcF0TtMp0enjCdKBUsj2jVXWQvAPB5QMjv8ADC8z1XVmo9w8z+DOaUfLypQ+0CwL2AHAB/j/p7GBnWaL4XVALCJz0oH8V380FNNwAOAsLgCREIV94gItDR3WHhijOtvjbYdLA2M34E6hAAHATCAYuv3fUDJEolYGx6hR/HsR/zyVJGJ+HRPh/umlyKrJnBCXDRmkXoAASesXjH0hqXLJ3u230Ra5gHZCBgrdItrhpgtp5haMK9wF1WTzefAkBClpgkLV81Q9AtxbllymXpYYxzKgAJEOQHgCCWW+8Do/RV7pjBMm8EgNys3rUR6wCzJLf0HyaWnBDeJd5yk5a/HwSAFgFnP3sCYDbCx77/yQOO3UKz5Tt5wGyEj33/b6nEG19Sq1FfAAAAAElFTkSuQmCC',

                croppa: {},

                // 是否显示菜单
                showMenus: false,

                // 菜单
				menus: {
					shoot: '拍照',
					album: '从手机相册选择',
				},
            }
        },

        mounted (){
            
        },

        methods: {
            getPosition (){
                if('baidumap_location' in window){
                    console.error('baidumap_location ok~');
                    baidumap_location.getCurrentPosition (function (result) {
                        console.log('baidumap_location 11111111111');
                        console.log(JSON.stringify(result))
                    }, function (error) {
                        console.log('baidumap_location 22222222222');
                        console.log(JSON.stringify(error))
                    });
                } else {
                    console.error('baidumap_location 未找到~');
                };
            },
            menuClick (action, item){
                if(!env.isCordova()){
                    this.$vux.toast.text('当前运行环境不支持此功能~', 'top');
                    return false;
                };

                let options= {

                    //图片质量，或者可以说图片的压缩比例，压缩后的图片可以减少存储空间和传输带宽，设置范围为0-100
                    quality: 75,

                    //规定API怎样返回照片
                    // .FILE_URI 是默认选项前边提到过
                    // .DATA_URL 返回用base-64编码的图像，因为是js处理，可能会造成js应用崩溃
                    // .NATIVE_URI 返回图像的本地的URI
                    //fwf -> 在这里（OA）,我们使用base64方式，因为url地址获取不到
                    destinationType: Camera.DestinationType.DATA_URL,

                    //定义函数如何获取图片。取值有以下几种：
                    // .CAMERA 使用摄像头来获取;
                    // .PHOTOLIBRARY 使用设备图库;
                    // .SAVEDPHOTOALBUM 从已存相册中获取图片;
                    // .PHOTOLIBRARY 打开照片库;
                    // sourceType: Camera.PictureSourceType.CAMERA,

                    //是否允许编辑，如果设置为true,用户可对图片进行缩小放大及滑动等操作来编辑图片
                    allowEdit: false,

                    //告诉函数返回何种图片类型，支持的选项有JPEG和PNG.
                    encodingType: Camera.EncodingType.JPEG,

                    //目标高度
                    // targetWdith: 220,

                    //目标宽度
                    // targetHeight: 220,

                    //设置项调用相机自带的设置项
                    popoverOptions: CameraPopoverOptions,

                    //是否保存到本地相册中
                    saveToPhotoAlbum: false
                };

                switch (action) {
                    case 'shoot': options.sourceType = Camera.PictureSourceType.CAMERA; break;
                    case 'album': options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY; break;
                    default: break;
                };

                navigator.camera.getPicture(this.onSuccess, this.onError, options);
            },

            // 成功
            onSuccess (imageURL){
                console.log('成功获取到地址：');
                console.log(imageURL);
                this.base64 = "data:image/jpeg;base64," + imageURL;
            },
            
            // 失败
            onError (e){
                console.log("onError:"+e);
            },

            // 确定并上传头像
            croppaConfirm (){
                let that = this;
                this.croppa.generateBlob(
                    blob => {
                    // 编写代码上传裁剪的图像文件
                    // this.croppa.generateDataUrl() base64
                    // console.log(blob);
                    let formdata = new FormData();
                    formdata.append("file", blob, "image.jpg"); //封装到formdata中
                    console.log(formdata);
                    //uploadFile接口和post两处不同
                    //一：是header设置为'Content-Type': 'multipart/form-data'
                    //二：千万不要对data数据进行Qs.stringify()...太坑了
                    // that.$http.uploadFile(上传地址, formdata).then(res => {
                    //     console.log(res);
                    //     let data = res.data;
                    //     if (data.status) {
                    //     that.$message.success("保存成功");
                    //     that.dialogVisible = false;
                    //     }
                    // });
                    }, "image/jpeg", 0.8
                ); // 80%压缩文件
            },

            // 取消操作
            croppaCancel (){

            }
        }
    }
</script>


<style lang="scss">
    .my-photo{
        width: 100vw;
        height: 100vh;
        background: #000;

        .vux-header{
            background: #000;

            .left-arrow::before{
                border-color: #fff !important;
            }

            .vux-header-back, .vux-header-more::after{
                color: #fff;
            }
        }

        .curr-photo{
            width: 100vw;
            height: 100vw;
            display: block;
            background: #fff url(../../assets/face.jpg) no-repeat scroll center / 100%;
            position: fixed;
            top: calc((100vh - 100vw) / 2);

            img{
                width: 100%;
                height: 100%;
            }
        }

        .croppa-layout{
            width: 100vw;
            height: 100vh;
            background: #000;
            position: fixed;
            top: 0;
            z-index: 100;

            .croppa-comment{
                position: absolute;
                top: calc((100vh - 100vw - 50px) / 2);

                .reference{
                    width: 20px;
                    height: 20px;
                    border-color: #fff;
                    display: block;
                    position: absolute;
                    border-width: 2px;
                }

                .reference1{ top: 5px; left: 5px; border-top-style: solid; border-left-style: solid; }
                .reference2{ top: 5px; right: 5px; border-top-style: solid; border-right-style: solid; }
                .reference3{ bottom: 9px; left: 5px; border-bottom-style: solid; border-left-style: solid; }
                .reference4{ bottom: 9px; right: 5px; border-bottom-style: solid; border-right-style: solid; }
            }

            .action-footer{
                width: 100vw;
                height: 50px;
                position: absolute;
                bottom: 0;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                &::before{
                    width: 100vw;
                    content: " ";
                    height: 1px;
                    background: #ccc;
                    transform-origin: 0 0;
				    transform: scaleY(0.2);
                }

                span{
                    width: calc(100vw / 3);
                    height: 50px;
                    line-height: 50px;
                    color: #fff;
                    font-size: 14px;
                    display: inline-block;
                    text-align: center;
                }

                .rotate-btn{
                    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAFH0lEQVR4Xu2bj3EVNxDGdysIVBCoAFxBSAVJKghUgKkgUEFCBYEKSCogVABUAFSAXcEyP8/ejJBXd9JJ8nsZP814bI/v6Xa//fftSla55Utvuf5yAuDkAbccgVMI3HIHOEwSNLOHIvKjiPB9WfdE5LP/ciEiH0Tko6ry87R1IyFgZndE5BcR+VVEHokIv9cugPhPRF6rKj8PXVMBMDOs+oeIPB4kNQD8paqvB+03JwQmKJ7rS6g8U9V/eoEY7gFm9lREnje6OXq8E5GfGhUiNJ6o6pI7Gj8u4zzA4/yNx/iaIB9FBMsh/IcoyfleJEjyBXnjwcqGJElA2OUNQzzAszrKE/PRuiR2PX6bs7qHFHnkXER+KLzjXFVftrpANwCu/NuCy6M44fBqRDlzzwAEEmu0eM+TFhC6AHDLvC8oT0w/7onPkiIO+qtCaLxQVUCvWrsBcGtg+ZTMLC9tEqJK0uwhfz9h9XvweXICAG2uHgCIeRJUvqpfvildxQNmhqI5COSZn2uI0y4AzAzFAeCgyi8vL4BAhTnbwrAZAHe9T0Hcv1RVEtRBlplRVnMeAVkiTIprDwAkmDwL07REueDGwHDDQIjSMkko3F+rQE0AFKxPqXtUE2+z0SiE5mpCbgUgsj5d2qhmpxujIBQuVPVuaeNWAIj9nO3hYru5eLfG18sj9JnynK5iZaoGwMkHpCddR2X9pCrQNqf9w7+qGpXs+mbIzCL3p9aSfY9qmRkh+XcqlKqGxm7xgLzMXKpqy2QnBMnpNOOxq5GYqkKhu5bvSbimKzRWCwCWbVh0qxrpvaJQTnPuQD4hZrs8y8zyMAirQQiAmeV1HkvngiLgd0Kq6osa5XnGzMgna9zht709vu+fU+SQqJUAgD0x2WlZ1UywkE/yd22SmDXhgne8U1UqxHerBAAWz1nV2vsgQ/dqe34z+1o5MtvdWAWkqB4Ad6FrmXQFgWp3LSSo0tbVXpVvYGY5H2gDwEGIGoz8XeHGJY3+bwCQpHLyk+vWzATNjPguzfbS/XtCoN8D3AsiArQIuWvyU5kEm/JKEAK53O0h4ACQEKmpkJV0faGM1Sa+QMC8TuePVOeVKNzMLK9k9WUwEDaaAPUKCLBYKS+3AMswtZcI5fmrnggVEE03bEp8G/UaCrx8McYacgBqZjlz7abCCAm/JjZx/aNpgWs8trsZShKitMzd16w/629mxjEZx/HL6m+HZwk7et8Cz+gfiIwWdNZ+wYh8tW2vbodnCTxy34L1xw1FRwo7Yy8zYxaYdnybZKrLA3yoQR1nVsAhRNV53CTlI8Y6/mBkEd7MOI/jpemU+GxUHW8BKZoB+g2zzcOa3R7QeyjZouAGkULJ/H5C9WHNbgCcF0TtMp0enjCdKBUsj2jVXWQvAPB5QMjv8ADC8z1XVmo9w8z+DOaUfLypQ+0CwL2AHAB/j/p7GBnWaL4XVALCJz0oH8V380FNNwAOAsLgCREIV94gItDR3WHhijOtvjbYdLA2M34E6hAAHATCAYuv3fUDJEolYGx6hR/HsR/zyVJGJ+HRPh/umlyKrJnBCXDRmkXoAASesXjH0hqXLJ3u230Ra5gHZCBgrdItrhpgtp5haMK9wF1WTzefAkBClpgkLV81Q9AtxbllymXpYYxzKgAJEOQHgCCWW+8Do/RV7pjBMm8EgNys3rUR6wCzJLf0HyaWnBDeJd5yk5a/HwSAFgFnP3sCYDbCx77/yQOO3UKz5Tt5wGyEj33/b6nEG19Sq1FfAAAAAElFTkSuQmCC) no-repeat scroll center / 25px;
                }
            }
        }
    }
</style>
