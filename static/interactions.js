function showFullArticle(url) {
    // Remove any cursor before navigating to the article
    const terminal = document.querySelector('h1');
    const cursor = document.querySelector('.cursor');
    if (terminal.contains(cursor)) {
        terminal.removeChild(cursor);
    }
    window.location.href = url;
}

document.addEventListener('DOMContentLoaded', () => {
    // Terminal typing effect
    const terminalText = [
        "INITIALIZING CYBERNEWS NETWORK...",
        "ACCESSING MAINFRAME...",
        "DECRYPTING NEWS STREAMS...",
        "SYSTEM READY"
    ];

    let currentLine = 0;
    let charIndex = 0;
    const terminal = document.querySelector('h1');
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '_';

    function typeLine() {
        if (currentLine < terminalText.length) {
            if (charIndex < terminalText[currentLine].length) {
                terminal.innerHTML = terminalText[currentLine].substring(0, charIndex+1);
                terminal.appendChild(cursor);
                charIndex++;
                setTimeout(typeLine, 50);
            } else {
                setTimeout(eraseLine, 2000);
            }
        } else {
            currentLine = 0;
            setTimeout(typeLine, 1000);
        }
    }

    function eraseLine() {
        if (charIndex > 0) {
            terminal.innerHTML = terminalText[currentLine].substring(0, charIndex-1);
            terminal.appendChild(cursor);
            charIndex--;
            setTimeout(eraseLine, 30);
        } else {
            currentLine++;
            charIndex = 0;
            setTimeout(typeLine, 500);
        }
    }

    // Start the animation
    typeLine();

    // Matrix effect
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍｦｲｸｺｿﾁﾄﾉﾌﾔﾖﾙﾚﾛﾝ日WAGS';
    const fontSize = 18;
    const columns = canvas.width/fontSize;
    const drops = Array(Math.floor(columns)).fill(0);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        drops.forEach((drop, i) => {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drop * fontSize);

            if (drop * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        });

        requestAnimationFrame(drawMatrix);
    }

    drawMatrix();
});
