class DrawingApp {
    constructor() {
        this.initializeVariables();
        this.setupCanvas();
        this.setupEventListeners();
        this.createNewLayer();
    }

    initializeVariables() {
        this.layers = [];
        this.currentLayer = null;
        this.isDrawing = false;
        this.tool = 'brush';
        this.brushSize = 5;
        this.brushOpacity = 1;
        this.color = '#000000';
        this.undoStack = [];
        this.redoStack = [];
    }

    setupCanvas() {
        this.canvasWrapper = document.getElementById('canvasWrapper');
        this.canvasWidth = 800;
        this.canvasHeight = 600;
        this.canvasWrapper.style.width = `${this.canvasWidth}px`;
        this.canvasWrapper.style.height = `${this.canvasHeight}px`;
    }

    createNewLayer() {
        const canvas = document.createElement('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        const ctx = canvas.getContext('2d');
        
        const layer = {
            canvas,
            ctx,
            visible: true,
            name: `图层 ${this.layers.length + 1}`
        };

        this.layers.push(layer);
        this.currentLayer = layer;
        this.canvasWrapper.appendChild(canvas);
        this.updateLayersList();
    }

    setupEventListeners() {
        // 工具选择
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.tool = e.target.closest('.tool-btn').dataset.tool;
                document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
                e.target.closest('.tool-btn').classList.add('active');
            });
        });

        // 画笔设置
        document.getElementById('brushSize').addEventListener('input', (e) => {
            this.brushSize = parseInt(e.target.value);
        });

        document.getElementById('brushOpacity').addEventListener('input', (e) => {
            this.brushOpacity = parseInt(e.target.value) / 100;
        });

        document.getElementById('colorPicker').addEventListener('input', (e) => {
            this.color = e.target.value;
        });

        // 画布事件
        this.canvasWrapper.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvasWrapper.addEventListener('mousemove', this.draw.bind(this));
        this.canvasWrapper.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvasWrapper.addEventListener('mouseleave', this.stopDrawing.bind(this));

        // 操作按钮
        document.getElementById('undo').addEventListener('click', this.undo.bind(this));
        document.getElementById('redo').addEventListener('click', this.redo.bind(this));
        document.getElementById('clear').addEventListener('click', this.clear.bind(this));
        document.getElementById('save').addEventListener('click', this.save.bind(this));
        document.getElementById('addLayer').addEventListener('click', this.createNewLayer.bind(this));
    }

    startDrawing(e) {
        this.isDrawing = true;
        const rect = this.currentLayer.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
        
        // 保存当前状态用于撤销
        this.saveState();
    }

    draw(e) {
        if (!this.isDrawing || !this.currentLayer.visible) return;

        const rect = this.currentLayer.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ctx = this.currentLayer.ctx;
        ctx.globalAlpha = this.brushOpacity;

        switch (this.tool) {
            case 'brush':
                this.drawBrush(ctx, x, y);
                break;
            case 'airbrush':
                this.drawAirbrush(ctx, x, y);
                break;
            case 'eraser':
                this.erase(ctx, x, y);
                break;
            case 'circle':
                this.drawCircle(ctx, x, y);
                break;
            case 'rectangle':
                this.drawRectangle(ctx, x, y);
                break;
        }

        this.lastX = x;
        this.lastY = y;
    }

    drawBrush(ctx, x, y) {
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
    }

    drawAirbrush(ctx, x, y) {
        const density = this.brushSize * 2;
        for (let i = 0; i < density; i++) {
            const offsetX = this.getRandomOffset(this.brushSize);
            const offsetY = this.getRandomOffset(this.brushSize);
            ctx.fillStyle = this.color;
            ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
    }

    getRandomOffset(radius) {
        return (Math.random() - 0.5) * radius * 2;
    }

    erase(ctx, x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        this.drawBrush(ctx, x, y);
        ctx.globalCompositeOperation = 'source-over';
    }

    drawCircle(ctx, x, y) {
        const radius = Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2));
        ctx.beginPath();
        ctx.arc(this.lastX, this.lastY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.brushSize;
        ctx.stroke();
    }

    drawRectangle(ctx, x, y) {
        const width = x - this.lastX;
        const height = y - this.lastY;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.brushSize;
        ctx.strokeRect(this.lastX, this.lastY, width, height);
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    saveState() {
        const imageData = this.currentLayer.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.undoStack.push(imageData);
        this.redoStack = []; // 清空重做栈
    }

    undo() {
        if (this.undoStack.length === 0) return;
        
        const imageData = this.undoStack.pop();
        const currentImageData = this.currentLayer.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.redoStack.push(currentImageData);
        
        this.currentLayer.ctx.putImageData(imageData, 0, 0);
    }

    redo() {
        if (this.redoStack.length === 0) return;
        
        const imageData = this.redoStack.pop();
        const currentImageData = this.currentLayer.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
        this.undoStack.push(currentImageData);
        
        this.currentLayer.ctx.putImageData(imageData, 0, 0);
    }

    clear() {
        this.saveState();
        this.currentLayer.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    save() {
        // 创建一个临时画布来合并所有图层
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvasWidth;
        tempCanvas.height = this.canvasHeight;
        const tempCtx = tempCanvas.getContext('2d');

        // 按顺序绘制所有可见图层
        this.layers.forEach(layer => {
            if (layer.visible) {
                tempCtx.drawImage(layer.canvas, 0, 0);
            }
        });

        // 创建下载链接
        const link = document.createElement('a');
        link.download = 'drawing.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    }

    updateLayersList() {
        const layersList = document.getElementById('layersList');
        layersList.innerHTML = '';

        this.layers.forEach((layer, index) => {
            const layerItem = document.createElement('div');
            layerItem.className = 'layer-item';
            layerItem.innerHTML = `
                <input type="checkbox" class="layer-visibility" 
                    ${layer.visible ? 'checked' : ''}>
                <span class="layer-name">${layer.name}</span>
                <button class="layer-delete">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            // 图层可见性切换
            const visibilityCheckbox = layerItem.querySelector('.layer-visibility');
            visibilityCheckbox.addEventListener('change', (e) => {
                layer.visible = e.target.checked;
                layer.canvas.style.display = layer.visible ? 'block' : 'none';
            });

            // 删除图层
            const deleteButton = layerItem.querySelector('.layer-delete');
            deleteButton.addEventListener('click', () => {
                if (this.layers.length > 1) {
                    this.layers = this.layers.filter(l => l !== layer);
                    layer.canvas.remove();
                    this.currentLayer = this.layers[this.layers.length - 1];
                    this.updateLayersList();
                }
            });

            // 选择当前图层
            layerItem.addEventListener('click', (e) => {
                if (!e.target.matches('.layer-visibility, .layer-delete')) {
                    this.currentLayer = layer;
                    document.querySelectorAll('.layer-item').forEach(item => 
                        item.classList.remove('active'));
                    layerItem.classList.add('active');
                }
            });

            layersList.prepend(layerItem);
        });
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new DrawingApp();
}); 