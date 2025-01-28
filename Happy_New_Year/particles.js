// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// 创建粒子材质
const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    transparent: true,
    opacity: 1.0,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

// 创建粒子几何体
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 100000;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    const x = (Math.random() - 0.5) * 400;
    const y = (Math.random() - 0.5) * 400;
    const z = (Math.random() - 0.5) * 400;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const color = Math.random() * 0.5 + 0.5;
    colors[i * 3] = color;
    colors[i * 3 + 1] = color * 0.8;
    colors[i * 3 + 2] = 0.2;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// 创建粒子系统
const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
scene.add(particleSystem);

// 设置相机位置
camera.position.z = 100;

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    particleSystem.rotation.y += 0.001;
    renderer.render(scene, camera);
}

animate();

// 延迟1秒后显示文字
setTimeout(() => {
    document.getElementById('message').style.opacity = 1;
}, 1000);

// 添加烟花效果
window.addEventListener('click', (event) => {
    const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    const vector = new THREE.Vector3(mouseX, mouseY, 0.5).unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    const pos = camera.position.clone().add(dir.multiplyScalar(distance));

    const newPositions = [];
    const newColors = [];

    for (let i = 0; i < 100; i++) {
        const x = pos.x + (Math.random() - 0.5) * 10;
        const y = pos.y + (Math.random() - 0.5) * 10;
        const z = pos.z + (Math.random() - 0.5) * 10;

        newPositions.push(x, y, z);

        const color = Math.random() * 0.5 + 0.5;
        newColors.push(color, color * 0.8, 0.2);
    }

    const currentPositions = particlesGeometry.attributes.position.array;
    const currentColors = particlesGeometry.attributes.color.array;

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([...currentPositions, ...newPositions]), 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([...currentColors, ...newColors]), 3));
});

document.addEventListener('DOMContentLoaded', () => {
    const messageElement = document.getElementById('message');
    const lines = messageElement.innerHTML.split('<br>');

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].trim();
        if (currentLine.length === 1) {
            lines[i - 1] += currentLine;
            lines[i] = '';
        }
    }

    messageElement.innerHTML = lines.filter(line => line !== '').join('<br>');
});
