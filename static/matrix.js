class MatrixBackground {
    constructor() {
        this.canvas = document.querySelector('.matrix-bg');
        this.ctx = this.canvas.getContext('2d');
        this.symbols = [];
        this.fps = 30;
        this.columns = 0;

        this.initialize();
        this.fetchMatrixData();
    }

    async fetchMatrixData() {
        const response = await fetch('/matrix-data');
        const data = await response.json();
        this.symbols = data.symbols;
        this.colors = data.colors;
        this.initRain();
    }

    initialize() {
        window.addEventListener('resize', () => this.resizeCanvas());
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.columns = Math.floor(window.innerWidth / 20);
    }

    initRain() {
        setInterval(() => this.draw(), 1000/this.fps);
        for(let i = 0; i < this.columns; i++) {
            this.rain(i * 20, -Math.random() * 500);
        }
    }

    rain(x, y) {
        const speed = Math.random() * 5 + 1;
        const size = Math.random() * 20 + 10;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.drawDroplet(x, y, size, color);
        if(y < window.innerHeight + 50) {
            requestAnimationFrame(() => this.rain(x, y + speed));
        }
    }

    drawDroplet(x, y, size, color) {
        this.ctx.fillStyle = color;
        const symbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        this.ctx.fillText(symbol, x, y);
    }

    draw() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

new MatrixBackground();
