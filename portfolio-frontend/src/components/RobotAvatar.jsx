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
    let robotHead, robotBody, robotVisor, robotCore;

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

      // Body (Chest)
      const bodyGeo = new THREE.CylinderGeometry(0.8, 0.6, 1.6, 16);
      robotBody = new THREE.Mesh(bodyGeo, metalMaterial);
      robotBody.position.y = -0.5;
      robotGroup.add(robotBody);

      // Reactor core on chest
      const coreGeo = new THREE.SphereGeometry(0.25, 16, 16);
      robotCore = new THREE.Mesh(coreGeo, purpleGlowMaterial);
      robotCore.position.set(0, 0.1, 0.65);
      robotBody.add(robotCore);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 16);
      const robotNeck = new THREE.Mesh(neckGeo, metalMaterial);
      robotNeck.position.y = 0.45;
      robotGroup.add(robotNeck);

      // Head Group (for rotation)
      robotHead = new THREE.Group();
      robotHead.position.y = 0.8;

      // Head Mesh
      const headGeo = new THREE.BoxGeometry(0.9, 0.7, 0.8);
      const headMesh = new THREE.Mesh(headGeo, metalMaterial);
      robotHead.add(headMesh);

      // Visor/Eyes
      const visorGeo = new THREE.BoxGeometry(0.7, 0.15, 0.1);
      robotVisor = new THREE.Mesh(visorGeo, cyanGlowMaterial);
      robotVisor.position.set(0, 0.05, 0.41);
      robotHead.add(robotVisor);

      // Ears/Antennas
      const earGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 8);
      const leftEar = new THREE.Mesh(earGeo, metalMaterial);
      leftEar.rotation.z = Math.PI / 2;
      leftEar.position.set(-0.5, 0, 0);
      robotHead.add(leftEar);

      const rightEar = leftEar.clone();
      rightEar.position.x = 0.5;
      robotHead.add(rightEar);

      robotGroup.add(robotHead);
      scene.add(robotGroup);

      robotGroup.position.y = -0.2;

      const clock = new THREE.Clock();

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        robotGroup.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.1;

        const pulse = 1.0 + Math.sin(elapsedTime * 4.0) * 0.2;
        robotCore.scale.set(pulse, pulse, pulse);

        targetX += (mouseX - targetX) * 0.08;
        targetY += (mouseY - targetY) * 0.08;

        if (robotHead) {
          robotHead.rotation.y = targetX * 0.5;
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
