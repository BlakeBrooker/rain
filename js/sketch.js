<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script>
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Create rain particles
        const rainCount = 10000;
        const rainGeometry = new THREE.BufferGeometry();
        const rainVertices = new Float32Array(rainCount * 3);
        const rainVelocities = new Float32Array(rainCount);

        for (let i = 0; i < rainCount; i++) {
            rainVertices[i * 3] = Math.random() * 200 - 100; // x position
            rainVertices[i * 3 + 1] = Math.random() * 200 - 100; // y position
            rainVertices[i * 3 + 2] = Math.random() * 200 - 100; // z position
            rainVelocities[i] = Math.random() * 0.5 + 0.5; // random speed
        }

        rainGeometry.setAttribute('position', new THREE.BufferAttribute(rainVertices, 3));
        const rainMaterial = new THREE.PointsMaterial({ color: 0xAAAAAA, size: 0.2 });
        const rain = new THREE.Points(rainGeometry, rainMaterial);
        scene.add(rain);

        // Create clouds
        const cloudGeometry = new THREE.SphereGeometry(15, 32, 32);
        const cloudMaterial = new THREE.MeshStandardMaterial({ color: 0xCCCCCC, transparent: true, opacity: 0.5 });
        const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
        cloud.position.set(0, 50, -100);
        scene.add(cloud);

        camera.position.z = 50;

        let cloudSpeed = 0.02;

        function animate() {
            requestAnimationFrame(animate);

            // Update rain position with wind effect
            rain.geometry.attributes.position.array.forEach((v, i) => {
                if (i % 3 === 1) { // y position
                    rain.geometry.attributes.position.array[i] -= rainVelocities[i / 3] * 0.1; // fall speed
                    if (v < -100) { // reset position
                        rain.geometry.attributes.position.array[i] = 100; // reset to top
                    }
                }
                if (i % 3 === 0) { // x position (wind effect)
                    rain.geometry.attributes.position.array[i] += Math.sin(v * 0.1) * 0.05; // slight horizontal movement
                }
            });
            rain.geometry.attributes.position.needsUpdate = true;

            // Animate clouds
            cloud.position.x += cloudSpeed;
            if (cloud.position.x > 100) {
                cloud.position.x = -100; // Reset position when out of bounds
            }

            renderer.render(scene, camera);
        }

        animate();
    </script>
