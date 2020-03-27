$(function () {
    // 滑块
    let $hua = $('.box1-right>p')
    console.log($hua)

    // 轮播图
    let $lunbo = $('.lunbo')
    let $list = $('.list')
    let $points = $('.pointsDiv>span')
    let $prev = $('#prev')
    let $next = $('#next')
    let TIME = 400 // 移动的总时间
    let ITEM_TIME = 20 //单元移动的间隔时间
    let PAGE_WIDTH = 600 // 一页的宽度
    let imgCount = $points.length //图片的数量
    let index = 0 //当前圆点的下标
    let moving = false //是否正在翻页中

    // 1. 点击向右(左)的图标, 平滑切换到下(上)一页
    $next.click(function () {
        nextPage(true)
    })
    $prev.click(function () {
        nextPage(false)
    })

    // 3. 每隔3s自动滑动到下一页
    let intervalId = setInterval(function () {
        nextPage(true)
    }, 1000)

    // 4. 当鼠标进入图片区域时, 自动切换停止, 当鼠标离开后,又开始自动切换
    $lunbo.hover(function () {
        clearInterval(intervalId)
    }, function () {
        intervalId = setInterval(function () {
            nextPage(true)
        }, 1000)
    })

    // 6. 点击圆点图标切换到对应的页
    $points.click(function () {
        let targetIndex = $(this).index()
        if(targetIndex!=index) {
            nextPage(targetIndex)
        }
    })

    /**
     * 平滑翻页
     * @param next
     *  true: 翻到下一页
     *  false: 翻到上一页
     *  数值: 翻到指定页
     */
    function nextPage (next) {
        if(moving) {
            return
        }
        moving = true // 标识正在翻页中

        let offset = 0 //移动的总距离
        // 计算offset
        if(typeof next==='boolean') {
            offset = next ? -PAGE_WIDTH : PAGE_WIDTH
        } else {
            offset = -PAGE_WIDTH * (next - index)
        }

        // 计算单元移动的距离
        let itemOffset = offset/(TIME/ITEM_TIME)
        // 当前的left
        let currLeft = $list.position().left
        // 目标的left
        let targetLeft = currLeft + offset
        // 启动循环定时器不断移动, 到达目标位置时清除定时器
        let intervalId = setInterval(function () {
            // 计算当前要设置的left
            currLeft += itemOffset
            if(currLeft===targetLeft) {
                //清除定时器
                clearInterval(intervalId)
                //标识翻页完成
                moving = false

                // 如果滑动到了最左边的图片, 直接跳转到最右边的第2张图片
                if(currLeft===0) {
                    currLeft = -PAGE_WIDTH * imgCount
                } else if(currLeft===-PAGE_WIDTH*(imgCount+1)) {
                    // 如果滑动到了最右边的图片, 直接跳转到最左边的第2张图片
                    currLeft = -PAGE_WIDTH
                }
            }
            // 更新$list的left样式
            $list.css({
                left: currLeft
            })
        }, ITEM_TIME)

        // 5. 切换页面时, 下面的圆点也同步更新
        updatePoints(next)
    }

    /**
     * 更新标识圆点
     * @param next
     */
    function updatePoints (next) {
        let targetIndex = 0
        // 计算目标下标
        if(typeof next==='boolean') {
            if(next) {
                targetIndex = index + 1
                if(targetIndex===imgCount) {
                    targetIndex = 0
                }
            } else {
                targetIndex = index-1
                if(targetIndex===-1) {
                    targetIndex = imgCount-1
                }
            }
        } else {
            targetIndex = next
        }
        // 移除当前下标元素的class
        $points[index].className = ''
        // 给目标下标的元素指定class
        $points[targetIndex].className = 'on'
        //更新当前下标
        index = targetIndex
    }
    //  渲染曲线数据展示
    let $dom =document.getElementById('context3') // 获取父级元素
    let myChart = echarts.init($dom);
    $.get('https://edu.telking.com/api/?type=month', function (data) {
        myChart.setOption({
            xAxis: {
                type: 'category',
                data: data.data.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series : [
                {
                    data: data.data.series,
                    type: 'line',
                    showBackground: true,
                    lineStyle: {
                        color:'#4587ef',
                    },
                    itemStyle: {
                        color: "#4587ef"
                    },
                }
            ]
        })
    }, 'json')
    // 渲染柱状数据图
    let $dom5 =document.getElementById('context5') // 获取父级元素
    let myChart5 = echarts.init($dom5)
    $.get('https://edu.telking.com/api/?type=week', function (data) {
        myChart5.setOption({
            xAxis: {
                type: 'category',
                data: data.data.xAxis
            },
            yAxis: {
                type: 'value'
            },
            series : [
                {
                    data: data.data.series,
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(220, 220, 220, 0)'
                    },
                    itemStyle: {
                        color: '#4587ef'
                    },
                    barWidth:30
                }
            ]
        })
    }, 'json')
    // 渲染饼状数据图
    let $dom4 =document.getElementById('context4') // 获取父级元素
    let myChart4 = echarts.init($dom4)
    $.get('https://edu.telking.com/api/?type=week', function (data) {
        console.log(data)
        myChart4.setOption({
            series : [
                {
                    name: '访问来源',
                    type: 'pie',    // 设置图表类型为饼图
                    radius: '55%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
                    data:[
                        {value: data.data.series[0], name: data.data.xAxis[0]},
                        {value: data.data.series[1], name: data.data.xAxis[1]},
                        {value: data.data.series[2], name: data.data.xAxis[2]},
                        {value: data.data.series[3], name: data.data.xAxis[3]},
                        {value: data.data.series[4], name: data.data.xAxis[4]},
                        {value: data.data.series[5], name: data.data.xAxis[5]},
                        {value: data.data.series[6], name: data.data.xAxis[6]},
                        ]
                }
            ]
        })
    }, 'json')
})
