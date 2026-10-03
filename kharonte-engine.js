/* Kharonte Engine — procedural Three.js hero artifact.
 * Built as a progressive enhancement: the screenshot wall remains the fallback.
 */
(function () {
  'use strict';

  const root = document.querySelector('[data-kharonte-engine]');
  if (!root || !window.THREE) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const canvas = root.querySelector('canvas');
  const fallback = root.parentElement && root.parentElement.querySelector('.hero-product-wall');

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  } catch (_) {
    root.classList.add('is-unavailable');
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.86;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
  camera.position.set(0.3, 0.15, 9.65);

  const engine = new THREE.Group();
  engine.rotation.set(-0.055, -0.22, -0.025);
  scene.add(engine);

  const graphite = new THREE.MeshPhysicalMaterial({ color: 0x111722, metalness: 0.88, roughness: 0.29, clearcoat: 0.42, clearcoatRoughness: 0.38 });
  const graphiteSoft = new THREE.MeshStandardMaterial({ color: 0x202938, metalness: 0.62, roughness: 0.48 });
  const cavity = new THREE.MeshStandardMaterial({ color: 0x03070d, metalness: 0.35, roughness: 0.66 });
  const ceramic = new THREE.MeshStandardMaterial({ color: 0x0b111c, metalness: 0.72, roughness: 0.36 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xffa31a, emissive: 0xff7400, emissiveIntensity: 3.6, roughness: 0.25 });
  const cyan = new THREE.MeshStandardMaterial({ color: 0x6ff7ff, emissive: 0x17d9ff, emissiveIntensity: 2.5, roughness: 0.2 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x8d4d0b, metalness: 0.05, roughness: 0.12, transmission: 0.45, transparent: true, opacity: 0.72, thickness: 0.25 });

  function roundedBox(w, h, d, radius, material) {
    const x = -w / 2, y = -h / 2;
    const shape = new THREE.Shape();
    shape.moveTo(x + radius, y);
    shape.lineTo(x + w - radius, y);
    shape.quadraticCurveTo(x + w, y, x + w, y + radius);
    shape.lineTo(x + w, y + h - radius);
    shape.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    shape.lineTo(x + radius, y + h);
    shape.quadraticCurveTo(x, y + h, x, y + h - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: Math.min(radius * 0.45, 0.06), bevelThickness: 0.035, curveSegments: 3 });
    geometry.center();
    return new THREE.Mesh(geometry, material);
  }

  function panel(w, h, d, material, x, y, z, rotation) {
    const mesh = roundedBox(w, h, d, Math.min(w, h) * 0.1, material);
    mesh.position.set(x, y, z);
    if (rotation) mesh.rotation.z = rotation;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    engine.add(mesh);
    return mesh;
  }

  const spine = panel(0.92, 5.15, 0.56, graphite, -0.58, 0, 0, 0);
  panel(0.55, 4.56, 0.60, graphiteSoft, -0.58, 0, 0.02, 0);
  panel(0.16, 3.28, 0.64, cavity, -0.55, 0.08, 0.08, 0);

  const coreGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.115, 0.115, 2.66, 18), glass);
  coreGlass.position.set(-0.55, 0.15, 0.42);
  coreGlass.castShadow = true;
  engine.add(coreGlass);
  const core = new THREE.Mesh(new THREE.CylinderGeometry(0.047, 0.047, 2.42, 12), amber);
  core.position.copy(coreGlass.position);
  engine.add(core);

  const hub = new THREE.Group();
  hub.position.set(0.08, 0, 0.11);
  engine.add(hub);
  [
    [0.48, 0.18, graphite],
    [0.34, 0.23, graphiteSoft],
    [0.23, 0.27, amber],
    [0.14, 0.31, cavity]
  ].forEach(([r, depth, material]) => {
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(r, r, depth, 32), material);
    ring.rotation.x = Math.PI / 2;
    ring.castShadow = true;
    hub.add(ring);
  });

  function arm(y, angle, length) {
    const group = new THREE.Group();
    group.position.set(0.18, y, 0);
    group.rotation.z = angle;
    engine.add(group);

    const body = roundedBox(length, 0.82, 0.56, 0.13, graphite);
    body.position.x = length * 0.48;
    body.castShadow = true;
    group.add(body);
    const cap = roundedBox(length * 0.78, 0.32, 0.61, 0.1, ceramic);
    cap.position.set(length * 0.56, 0.12, 0.03);
    group.add(cap);
    const vent = roundedBox(length * 0.48, 0.12, 0.635, 0.035, cavity);
    vent.position.set(length * 0.42, -0.18, 0.05);
    group.add(vent);
    const rail = roundedBox(length * 0.38, 0.045, 0.65, 0.015, amber);
    rail.position.set(length * 0.67, -0.31, 0.07);
    group.add(rail);
    return group;
  }

  const upperArm = arm(0.12, 0.69, 2.92);
  const lowerArm = arm(-0.14, -0.69, 2.75);

  const rail = panel(0.15, 3.74, 0.28, cavity, -1.18, 0, -0.02, 0);
  rail.position.z = -0.03;

  const products = [
    { name: 'Foodlio', color: '#1f9e59', image: './foodlio/screenshot-it.webp' },
    { name: 'Padel', color: '#ff7a12', image: './padel-match-manager/screenshot-it.webp' },
    { name: 'Preventivi', color: '#4a75ff', image: './assets/preventivi-facili-hub-it.webp' },
    { name: 'Aegis', color: '#7161e8', image: './aegis/screenshot-it.webp' },
    { name: 'FlipEven', color: '#00b9d8', image: './assets/flipeven-preview.png' }
  ];
  const cartridgeGroups = [];
  const textureLoader = new THREE.TextureLoader();
  products.forEach((product, i) => {
    const group = new THREE.Group();
    group.position.set(-1.62, 1.54 - i * 0.77, 0.06);
    engine.add(group);
    cartridgeGroups.push(group);

    const body = roundedBox(0.88, 0.49, 0.24, 0.09, i === 2 ? ceramic : graphiteSoft);
    body.castShadow = true;
    group.add(body);

    const statusMaterial = new THREE.MeshStandardMaterial({ color: product.color, emissive: product.color, emissiveIntensity: 1.5, roughness: 0.22 });
    const status = roundedBox(0.055, 0.24, 0.275, 0.015, statusMaterial);
    status.position.x = -0.36;
    group.add(status);

    textureLoader.load(product.image, (texture) => {
      texture.encoding = THREE.sRGBEncoding;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 8);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.57, 0.34), new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }));
      screen.position.set(0.08, 0, 0.185);
      group.add(screen);
    });
  });

  // Geometry details: restrained fasteners and vent fins, instanced for low draw overhead.
  const fastenerGeo = new THREE.CylinderGeometry(0.026, 0.026, 0.018, 10);
  const fasteners = new THREE.InstancedMesh(fastenerGeo, graphiteSoft, 16);
  const matrix = new THREE.Matrix4();
  let fi = 0;
  [-0.91, -0.25].forEach((x) => [-2.18, -1.35, 1.35, 2.18].forEach((y) => {
    matrix.makeRotationX(Math.PI / 2);
    matrix.setPosition(x, y, 0.34);
    fasteners.setMatrixAt(fi++, matrix);
  }));
  [0.92, 1.45].forEach((x) => [-0.48, 0.48].forEach((y) => {
    matrix.makeRotationX(Math.PI / 2);
    matrix.setPosition(x, y, 0.36);
    fasteners.setMatrixAt(fi++, matrix);
  }));
  while (fi < 16) {
    matrix.makeRotationX(Math.PI / 2);
    matrix.setPosition(-1.02, -1.7 + (fi - 12) * 1.1, 0.31);
    fasteners.setMatrixAt(fi++, matrix);
  }
  engine.add(fasteners);

  const key = new THREE.DirectionalLight(0xf2f5ff, 2.35);
  key.position.set(-4, 6, 7);
  key.castShadow = true;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x4d8bff, 0.62);
  fill.position.set(5, 1, 4);
  scene.add(fill);
  const warm = new THREE.PointLight(0xff8b18, 10, 6, 2);
  warm.position.set(-0.35, 0.1, 1.4);
  scene.add(warm);
  scene.add(new THREE.HemisphereLight(0x5c759d, 0x04070c, 0.38));

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 6.5), new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.28 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -2.68;
  shadow.receiveShadow = true;
  scene.add(shadow);

  let width = 0, height = 0, visible = true, pointerX = 0, pointerY = 0, targetX = 0, targetY = 0;
  const clock = new THREE.Clock();

  function resize() {
    const rect = root.getBoundingClientRect();
    const nextWidth = Math.max(1, Math.round(rect.width));
    const nextHeight = Math.max(1, Math.round(rect.height));
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function render() {
    resize();
    const elapsed = clock.getElapsedTime();
    if (!reduceMotion) {
      pointerX += (targetX - pointerX) * 0.045;
      pointerY += (targetY - pointerY) * 0.045;
      engine.rotation.y = -0.22 + pointerX * 0.16;
      engine.rotation.x = -0.055 + pointerY * 0.1 + Math.sin(elapsed * 0.42) * 0.012;
      engine.position.y = Math.sin(elapsed * 0.62) * 0.035;
      hub.rotation.y = elapsed * 0.22;
      core.material.emissiveIntensity = 3.3 + Math.sin(elapsed * 1.7) * 0.45;
      cartridgeGroups.forEach((group, i) => { group.position.z = 0.06 + Math.sin(elapsed * 0.7 + i * 0.62) * 0.025; });
      renderer.render(scene, camera);
      if (visible) requestAnimationFrame(render);
      return;
    }
    renderer.render(scene, camera);
  }

  if (finePointer && !reduceMotion) {
    root.addEventListener('pointermove', (event) => {
      const rect = root.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    }, { passive: true });
    root.addEventListener('pointerleave', () => { targetX = 0; targetY = 0; });
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    new IntersectionObserver((entries) => {
      const nextVisible = entries[0].isIntersecting;
      if (nextVisible && !visible) { visible = true; clock.start(); requestAnimationFrame(render); }
      visible = nextVisible;
    }, { threshold: 0.02 }).observe(root);
  }

  window.addEventListener('resize', resize, { passive: true });
  root.classList.add('is-ready');
  if (fallback) fallback.setAttribute('aria-hidden', 'true');
  render();
})();
