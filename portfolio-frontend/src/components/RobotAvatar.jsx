import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function RobotAvatar() {
  const containerRef = useRef(null);
  
  const [webglError, setWebglError] = useState(() => {
    try {
      const canvas = document.createElement("canvas");
      return !(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
    } catch {
      return true;
    }
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = (e) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", handleMotionChange);
    return () => motionQuery.removeEventListener("change", handleMotionChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let scene, camera, renderer, animationFrameId;
    let robotHead, robotBody, robotCore, robotHalo, reactorRing, sparkParticles;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);

    try {
      const width = container.clientWidth || 300;
      const height = container.clientHeight || 300;

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 0.5, 6);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0x0a1128, 1.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0x06b6d4, 2.5);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const glowLight = new THREE.PointLight(0x8b5cf6, 3, 10);
      glowLight.position.set(0, 0, 1);
      scene.add(glowLight);

      const robotGroup = new THREE.Group();

      const metalMaterial = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.8,
        roughness: 0.2,
      });

      const cyanGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
      });

      const purpleGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0x8b5cf6,
      });

      // Body (Segmented Torso Chassis)
      robotBody = new THREE.Group();
      robotBody.position.y = -0.5;

      // 1. Central Core chassis (metallic cylinder)
      const bodyGeo = new THREE.CylinderGeometry(0.5, 0.35, 1.3, 16);
      const centralBody = new THREE.Mesh(bodyGeo, metalMaterial);
      robotBody.add(centralBody);

      // 2. Segmented Front Chest Armor Plate
      const chestPlateGeo = new THREE.BoxGeometry(0.7, 0.8, 0.25);
      const chestPlate = new THREE.Mesh(chestPlateGeo, metalMaterial);
      chestPlate.position.set(0, 0.15, 0.25);
      robotBody.add(chestPlate);

      // 3. Reactor core on chest
      const coreGeo = new THREE.SphereGeometry(0.18, 16, 16);
      robotCore = new THREE.Mesh(coreGeo, purpleGlowMaterial);
      robotCore.position.set(0, 0.2, 0.38);
      robotBody.add(robotCore);

      // 4. Glowing Reactor Orbital Torus Ring
      const ringGeo = new THREE.TorusGeometry(0.26, 0.03, 8, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
      });
      reactorRing = new THREE.Mesh(ringGeo, ringMaterial);
      reactorRing.position.set(0, 0.2, 0.38);
      robotBody.add(reactorRing);

      // 5. Shoulder Joints & armor shields
      const shoulderGeo = new THREE.SphereGeometry(0.15, 16, 16);
      const leftShoulder = new THREE.Mesh(shoulderGeo, metalMaterial);
      leftShoulder.position.set(-0.7, 0.3, 0);
      robotBody.add(leftShoulder);

      const rightShoulder = leftShoulder.clone();
      rightShoulder.position.x = 0.7;
      robotBody.add(rightShoulder);

      const shieldGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.12, 16, 1, false, 0, Math.PI);
      const leftShield = new THREE.Mesh(shieldGeo, metalMaterial);
      leftShield.rotation.x = Math.PI / 2;
      leftShield.rotation.z = -Math.PI / 2;
      leftShield.position.set(-0.7, 0.42, 0);
      robotBody.add(leftShield);

      const rightShield = leftShield.clone();
      rightShield.rotation.z = Math.PI / 2;
      rightShield.position.x = 0.7;
      robotBody.add(rightShield);

      robotGroup.add(robotBody);

      // Neck (connecting body to head)
      const neckGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.3, 16);
      const robotNeck = new THREE.Mesh(neckGeo, metalMaterial);
      robotNeck.position.y = 0.35;
      robotGroup.add(robotNeck);

      // Head Group (for rotation)
      robotHead = new THREE.Group();
      robotHead.position.y = 0.75;

      // Head Mesh (Box with segmented cyan temple panels)
      const headGeo = new THREE.BoxGeometry(0.8, 0.65, 0.7);
      const headMesh = new THREE.Mesh(headGeo, metalMaterial);
      robotHead.add(headMesh);

      // Cybernetic Head Side-Panels (Mechanical Segmentation)
      const sidePanelGeo = new THREE.BoxGeometry(0.08, 0.45, 0.55);
      const leftPanel = new THREE.Mesh(sidePanelGeo, metalMaterial);
      leftPanel.position.set(-0.42, 0, 0);
      robotHead.add(leftPanel);

      const rightPanel = leftPanel.clone();
      rightPanel.position.x = 0.42;
      robotHead.add(rightPanel);

      // Dual-segment futuristic visors/lens
      const visorGeo = new THREE.BoxGeometry(0.3, 0.14, 0.08);
      
      const leftVisor = new THREE.Mesh(visorGeo, cyanGlowMaterial);
      leftVisor.position.set(-0.16, 0.03, 0.36);
      robotHead.add(leftVisor);

      const rightVisor = new THREE.Mesh(visorGeo, cyanGlowMaterial);
      rightVisor.position.set(0.16, 0.03, 0.36);
      robotHead.add(rightVisor);

      // Stepped Cybernetic Antenna structures
      const antBaseGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.08, 8);
      const antRodGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8);
      const antTipGeo = new THREE.SphereGeometry(0.04, 8, 8);

      const antGroupLeft = new THREE.Group();
      const antBaseLeft = new THREE.Mesh(antBaseGeo, metalMaterial);
      antBaseLeft.rotation.z = Math.PI / 2;
      antGroupLeft.add(antBaseLeft);

      const antRodLeft = new THREE.Mesh(antRodGeo, metalMaterial);
      antRodLeft.position.set(-0.2, 0.18, 0);
      antRodLeft.rotation.z = -Math.PI / 6;
      antGroupLeft.add(antRodLeft);

      const antTipLeft = new THREE.Mesh(antTipGeo, cyanGlowMaterial);
      antTipLeft.position.set(-0.28, 0.33, 0);
      antGroupLeft.add(antTipLeft);

      antGroupLeft.position.set(-0.42, 0.1, 0);
      robotHead.add(antGroupLeft);

      const antGroupRight = new THREE.Group();
      const antBaseRight = new THREE.Mesh(antBaseGeo, metalMaterial);
      antBaseRight.rotation.z = -Math.PI / 2;
      antGroupRight.add(antBaseRight);

      const antRodRight = new THREE.Mesh(antRodGeo, metalMaterial);
      antRodRight.position.set(0.2, 0.18, 0);
      antRodRight.rotation.z = Math.PI / 6;
      antGroupRight.add(antRodRight);

      const antTipRight = new THREE.Mesh(antTipGeo, cyanGlowMaterial);
      antTipRight.position.set(0.28, 0.33, 0);
      antGroupRight.add(antTipRight);

      antGroupRight.position.set(0.42, 0.1, 0);
      robotHead.add(antGroupRight);

      robotGroup.add(robotHead);

      // Cybernetic Floating Halo Ring behind/around robot's head
      const haloGeo = new THREE.TorusGeometry(0.95, 0.012, 8, 48);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        wireframe: true,
        transparent: true,
        opacity: 0.24,
      });
      robotHalo = new THREE.Mesh(haloGeo, haloMaterial);
      robotHalo.position.set(0, 0.75, -0.3);
      robotHalo.rotation.x = Math.PI / 6;
      robotGroup.add(robotHalo);

      scene.add(robotGroup);
      robotGroup.position.y = -0.2;

      // Subtle Futuristic Base Projection Grid Platform
      const gridHelper = new THREE.GridHelper(3.0, 10, 0x06b6d4, 0x06b6d4);
      gridHelper.position.y = -1.45;
      gridHelper.material.opacity = 0.1;
      gridHelper.material.transparent = true;
      scene.add(gridHelper);

      // Slow Spark Particles Floating Around
      const particleCount = 20;
      const particlesGeo = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 3.5;
        positions[i + 1] = (Math.random() - 0.5) * 3.0 + 0.2;
        positions[i + 2] = (Math.random() - 0.5) * 2.5;
      }
      particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
      });
      sparkParticles = new THREE.Points(particlesGeo, particleMat);
      scene.add(sparkParticles);

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Subtle bobbing motion
        robotGroup.position.y = -0.2 + Math.sin(elapsedTime * 1.3) * 0.08;

        // Reactor pulsing scale
        const pulse = 1.0 + Math.sin(elapsedTime * 3.0) * 0.15;
        robotCore.scale.set(pulse, pulse, pulse);

        // Reactor ring rotating
        if (reactorRing) {
          reactorRing.rotation.z = elapsedTime * 1.2;
        }

        // Halo rotating
        if (robotHalo) {
          robotHalo.rotation.z = -elapsedTime * 0.35;
          robotHalo.rotation.y = Math.sin(elapsedTime * 0.5) * 0.1;
        }

        // Stepped antenna tips pulse intensity
        const emissivePulse = 0.55 + Math.sin(elapsedTime * 3.0) * 0.25;
        if (antTipLeft && antTipLeft.material) antTipLeft.material.opacity = emissivePulse;
        if (antTipRight && antTipRight.material) antTipRight.material.opacity = emissivePulse;

        // Slow particles movement drift upwards
        if (sparkParticles) {
          const pos = sparkParticles.geometry.attributes.position.array;
          for (let i = 1; i < pos.length; i += 3) {
            pos[i] += 0.0035; // float upwards slowly
            if (pos[i] > 1.8) {
              pos[i] = -1.8; // reset to bottom
            }
          }
          sparkParticles.geometry.attributes.position.needsUpdate = true;
        }

        targetX += (mouseX - targetX) * 0.08;
        targetY += (mouseY - targetY) * 0.08;

        if (robotHead) {
          robotHead.rotation.y = targetX * 0.55;
          robotHead.rotation.x = -targetY * 0.3;
        }

        if (robotBody) {
          robotBody.rotation.y = targetX * 0.15;
        }

        renderer.render(scene, camera);
      };

      animate();

      const handleResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);

        if (scene) {
          scene.traverse((object) => {
            if (object.geometry) {
              object.geometry.dispose();
            }
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach((mat) => mat.dispose());
              } else {
                object.material.dispose();
              }
            }
          });
        }

        if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.error("WebGL initialization failed:", err);
      setTimeout(() => setWebglError(true), 0);
    }
  }, [reducedMotion]);

  if (reducedMotion || webglError) {
    return (
      <div className="avatar-fallback-container">
        <svg viewBox="0 0 100 100" className="avatar-fallback-svg">
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="50" y1="20" x2="50" y2="10" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="50" cy="10" r="3" fill="#8b5cf6" />
          <rect x="30" y="20" width="40" height="30" rx="4" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <rect x="35" y="28" width="30" height="6" rx="2" fill="#06b6d4" />
          <rect x="44" y="50" width="12" height="8" fill="#334155" />
          <path d="M 25 58 L 75 58 L 70 85 L 30 85 Z" fill="#1e293b" stroke="#06b6d4" strokeWidth="2" />
          <circle cx="50" cy="70" r="6" fill="#8b5cf6" />
          <circle cx="50" cy="70" r="2" fill="#fff" />
        </svg>
        <span className="telemetry-badge">2D ECO_MODE ACTIVE</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="avatar-3d-canvas"
      aria-label="3D Cybernetic Assistant Avatar tracking cursor movement"
    />
  );
}
