document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 获取表单数据
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        try {
            // 这里可以添加发送表单数据的逻辑
            console.log('Form submitted:', formData);
            
            // 显示成功消息
            alert('消息已发送，我们会尽快与您联系！');
            
            // 重置表单
            contactForm.reset();
            
        } catch (error) {
            console.error('Error:', error);
            alert('发送失败，请稍后重试或直接联系我们。');
        }
    });

    // 初始化高德地图
    initAMap();
});

function initAMap() {
    // 创建地图实例
    const map = new AMap.Map('amap-container', {
        zoom: 15,  // 地图缩放级别
        center: [121.5374, 31.2288],  // 地图中心点坐标，这里需要替换为您的实际坐标
        viewMode: '3D'  // 使用3D视图
    });

    // 添加标记点
    const marker = new AMap.Marker({
        position: [121.5374, 31.2288],  // 标记点坐标，需要替换为实际坐标
        title: 'Pineapple艺术工作室'
    });

    // 将标记点添加到地图
    map.add(marker);

    // 添加信息窗体
    const infoWindow = new AMap.InfoWindow({
        content: `
            <div class="info-window">
                <h3>Pineapple艺术工作室</h3>
                <p>地址：上海市浦东新区xxx路xxx号</p>
                <p>电话：您的联系电话</p>
            </div>
        `,
        offset: new AMap.Pixel(0, -30)
    });

    // 点击标记时打开信息窗体
    marker.on('click', () => {
        infoWindow.open(map, marker.getPosition());
    });

    // 添加地图控件
    map.addControl(new AMap.ToolBar());
    map.addControl(new AMap.Scale());

    // 添加地图样式切换控件
    map.addControl(new AMap.MapType({
        defaultType: 0 // 默认显示普通地图
    }));
} 