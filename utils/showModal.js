export const showModal = (options) => {
    let params = {
        title: "提示",
        content: "自定义内容", 
        align: "center", // 对齐方式 left/center/right
        cancelText: "取消", // 取消按钮的文字
        cancelColor: "#8F8F8F", // 取消按钮颜色
        confirmText: "确定", // 确认按钮文字
        confirmColor: "#FFAD15", // 确认按钮颜色 
        showCancel: true, // 是否显示取消按钮，默认为 true
    }

    Object.assign(params, options)

    let list = []
    Object.keys(params).forEach(ele => {
        list.push(ele + "=" + params[ele])
    })
    let paramsStr = list.join('&')

    uni.navigateTo({
        url: "/pages/modal/modal?" + paramsStr
    })

    return new Promise((resolve, reject) => {
        uni.$once("AppModalCancel", () => {
            reject()
        })
        uni.$once("AppModalConfirm", () => {
            resolve()
        })
    });
}