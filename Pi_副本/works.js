document.addEventListener('DOMContentLoaded', function() {
    // 图片查看器功能
    const viewer = document.getElementById('imageViewer');
    const viewerImage = document.getElementById('viewerImage');
    const caption = document.querySelector('.image-caption');
    const loading = document.querySelector('.loading');
    const workItems = document.querySelectorAll('.work-item img');
    let currentIndex = 0;
    const images = Array.from(workItems).map(img => ({
        src: img.src,
        caption: img.alt
    }));

    // 为每个图片添加点击事件
    workItems.forEach((img, index) => {
        img.addEventListener('click', () => {
            currentIndex = index;
            showImage();
        });
    });

    // 关闭按钮
    document.querySelector('.close-viewer').addEventListener('click', hideViewer);

    // 上一张按钮
    document.querySelector('.prev-btn').addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            showImage();
        }
    });

    // 下一张按钮
    document.querySelector('.next-btn').addEventListener('click', () => {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            showImage();
        }
    });

    // 点击遮罩层关闭
    document.querySelector('.viewer-overlay').addEventListener('click', hideViewer);

    // 键盘事件
    document.addEventListener('keydown', (e) => {
        if (viewer.classList.contains('active')) {
            if (e.key === 'Escape') {
                hideViewer();
            } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
                currentIndex--;
                showImage();
            } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
                currentIndex++;
                showImage();
            }
        }
    });

    // 显示图片
    function showImage() {
        viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        loading.style.display = 'block';
        viewerImage.style.display = 'none';

        viewerImage.src = images[currentIndex].src;
        caption.textContent = images[currentIndex].caption;

        // 更新导航按钮显示状态
        document.querySelector('.prev-btn').style.display = 
            currentIndex > 0 ? 'block' : 'none';
        document.querySelector('.next-btn').style.display = 
            currentIndex < images.length - 1 ? 'block' : 'none';
    }

    // 隐藏查看器
    function hideViewer() {
        viewer.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 图片加载完成后显示
    viewerImage.addEventListener('load', () => {
        loading.style.display = 'none';
        viewerImage.style.display = 'block';
    });

    // 作品筛选功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 筛选作品
            const filter = button.getAttribute('data-filter');
            const workItems = document.querySelectorAll('.work-item');

            workItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}); 