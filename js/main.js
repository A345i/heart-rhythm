// Анимация сердечного ритма
function initHeartAnimation() {
    // Один цикл сердечного ритма (P-QRS-T)
    function createBeatPath(startX) {
        const x = startX;
        return [
            { x: x, y: 90 },      // начало
            { x: x + 25, y: 90 }, // прямая линия
            { x: x + 35, y: 80 }, // P-волна (подъём)
            { x: x + 45, y: 90 }, // P-волна (спуск)
            { x: x + 70, y: 90 }, // прямая
            { x: x + 80, y: 85 }, // Q-зубец (начало)
            { x: x + 90, y: 25 }, // R-пик (резкий подъём)
            { x: x + 100, y: 155 }, // S-зубец (резкий спуск)
            { x: x + 115, y: 90 }, // возврат к изолинии
            { x: x + 150, y: 90 }, // прямая
            { x: x + 175, y: 75 }, // T-волна (подъём)
            { x: x + 200, y: 90 }, // T-волна (спуск)
            { x: x + 230, y: 90 }  // конец цикла
        ];
    }

    // Создаём несколько циклов
    const beats = 4;
    const beatWidth = 230;
    let allPoints = [];

    for (let i = 0; i < beats; i++) {
        const beatPoints = createBeatPath(i * beatWidth);
        allPoints = allPoints.concat(beatPoints);
    }

    const path = document.getElementById('ecg-path');
    const dot = document.getElementById('ecg-dot');
    const heart = document.getElementById('heart');

    if (!path || !dot || !heart) return;

    const cycleDuration = 6500; // мс на полный цикл

    function getHeartScale(elapsed) {
        const beatDuration = cycleDuration / beats;
        const beatProgress = (elapsed % beatDuration) / beatDuration;

        const rStart = 0.35;
        const rEnd = 0.52;

        if (beatProgress >= rStart && beatProgress <= rEnd) {
            const rProgress = (beatProgress - rStart) / (rEnd - rStart);
            if (rProgress < 0.5) {
                return 1 + rProgress * 0.1;
            } else {
                return 1 + (1 - rProgress) * 0.1;
            }
        }
        return 1;
    }

    function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;

        const cycleProgress = (elapsed % cycleDuration) / cycleDuration;
        const targetPoint = Math.floor(cycleProgress * allPoints.length);

        if (targetPoint > 0) {
            let d = `M ${allPoints[0].x} ${allPoints[0].y}`;
            for (let i = 1; i <= targetPoint; i++) {
                d += ` L ${allPoints[i].x} ${allPoints[i].y}`;
            }
            path.setAttribute('d', d);

            dot.setAttribute('cx', allPoints[targetPoint].x);
            dot.setAttribute('cy', allPoints[targetPoint].y);
        }

        const scale = getHeartScale(elapsed);
        heart.style.transform = `scale(${scale})`;

        requestAnimationFrame(animate);
    }

    let startTime = null;
    requestAnimationFrame(animate);
}

// Анимация при скролле
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.fade-in-up');

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 80) {
            element.classList.add('visible');
        }
    });
}

// Плавный скролл к якорям
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    handleScrollAnimation();
    window.addEventListener('scroll', handleScrollAnimation);
    initHeartAnimation();
});
