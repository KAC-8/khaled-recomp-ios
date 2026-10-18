import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { ExerciseId } from "../lib/data";
import { useApp } from "../lib/store";

type V = THREE.Vector3;
const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
const Y = v(0, 1, 0);
const boneDirection = v(0, 0, 0),
  ab = v(0, 0, 0),
  perp = v(0, 0, 0);

// Lofted contours give the mannequin anatomical volume rather than a line skeleton.
function contour(profile: number[][], material: THREE.Material, depth = 1) {
  const points = profile.map(([y, r]) => new THREE.Vector2(r, y));
  const geometry = new THREE.LatheGeometry(points, 36);
  geometry.scale(1, 1, depth);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}
function ellipsoid(
  parent: THREE.Group,
  material: THREE.Material,
  position: number[],
  scale: number[],
) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 18), material);
  mesh.position.set(...(position as [number, number, number]));
  mesh.scale.set(...(scale as [number, number, number]));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function segment(material: THREE.Material, radius: number, length: number) {
  const mesh = contour(
    [
      [0, 0.72 * radius],
      [length * 0.08, 0.95 * radius],
      [length * 0.25, 1.08 * radius],
      [length * 0.48, radius],
      [length * 0.72, 0.85 * radius],
      [length * 0.92, 0.68 * radius],
      [length, 0.62 * radius],
    ],
    material,
    0.88,
  );
  return mesh;
}
function pointBone(mesh: THREE.Object3D, a: V, b: V, length: number) {
  mesh.position.copy(a);
  mesh.quaternion.setFromUnitVectors(
    Y,
    boneDirection.subVectors(b, a).normalize(),
  );
  mesh.scale.y = a.distanceTo(b) / length;
}
function elbow(a: V, b: V, bend: V, l1: number, l2: number, out: V) {
  ab.subVectors(b, a);
  const dist = Math.min(ab.length(), l1 + l2 - 0.001);
  ab.normalize();
  const along = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist),
    height = Math.sqrt(Math.max(0.001, l1 * l1 - along * along));
  perp.copy(bend).addScaledVector(ab, -bend.dot(ab)).normalize();
  return out.copy(a).addScaledVector(ab, along).addScaledVector(perp, height);
}
export default function ExerciseScene({
  exercise,
  playing,
  phase,
  view,
}: {
  exercise: ExerciseId;
  playing: boolean;
  phase: number;
  view: "angle" | "side";
}) {
  const mount = useRef<HTMLDivElement>(null);
  const values = useRef({ exercise, playing, phase, view });
  values.current = { exercise, playing, phase, view };
  const [failed, setFailed] = useState(false);
  const { t } = useApp();
  useEffect(() => {
    const host = mount.current!;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: "low-power",
      });
    } catch {
      setFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setClearColor(0xeeeeef);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;
    host.appendChild(renderer.domElement);
    renderer.domElement.setAttribute("aria-label", "3D exercise demonstration");
    renderer.domElement.setAttribute("role", "img");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xeeeeef, 8, 15);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(3.6, 2.3, 4.3);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = 1.55;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    const pmrem = new THREE.PMREMGenerator(renderer),
      room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    scene.environment = env.texture;
    room.dispose();
    scene.add(new THREE.HemisphereLight(0xffffff, 0x8b8b94, 1.2));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(3, 6, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -3;
    key.shadow.bias = -0.001;
    key.shadow.normalBias = 0.02;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xffb089, 2.2);
    rim.position.set(-3, 3, -2);
    scene.add(rim);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0xeeeeef, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const platform = new THREE.Mesh(
      new THREE.CylinderGeometry(1.5, 1.5, 0.035, 80),
      new THREE.MeshStandardMaterial({ color: 0xe1e1e3, roughness: 0.9 }),
    );
    platform.position.y = 0.018;
    platform.receiveShadow = true;
    scene.add(platform);
    const body = new THREE.MeshStandardMaterial({
      color: 0x24272c,
      roughness: 0.5,
      metalness: 0.15,
    });
    const muscle = new THREE.MeshStandardMaterial({
      color: 0xd75a29,
      roughness: 0.65,
      metalness: 0.05,
    });
    const fabric = new THREE.MeshStandardMaterial({
      color: 0x141519,
      roughness: 0.96,
    });
    const sole = new THREE.MeshStandardMaterial({
      color: 0xbfc0c3,
      roughness: 0.8,
    });
    const torso = new THREE.Group();
    scene.add(torso);
    torso.add(
      contour(
        [
          [-0.07, 0.14],
          [0, 0.19],
          [0.1, 0.18],
          [0.2, 0.19],
          [0.31, 0.245],
          [0.43, 0.29],
          [0.51, 0.29],
          [0.55, 0.21],
          [0.58, 0.11],
        ],
        body,
        0.6,
      ),
    );
    const pecs = [
      ellipsoid(torso, muscle, [-0.132, 0.44, 0.122], [0.132, 0.103, 0.052]),
      ellipsoid(torso, muscle, [0.132, 0.44, 0.122], [0.132, 0.103, 0.052]),
    ];
    for (let i = 0; i < 3; i++)
      for (const x of [-0.055, 0.055])
        ellipsoid(
          torso,
          body,
          [x, 0.18 + i * 0.067, 0.112],
          [0.05, 0.034, 0.023],
        );
    ellipsoid(torso, body, [0, 0.62, 0], [0.084, 0.105, 0.077]);
    const head = new THREE.Group();
    head.position.set(0, 0.76, 0.003);
    torso.add(head);
    ellipsoid(head, body, [0, 0.03, 0], [0.108, 0.142, 0.106]);
    ellipsoid(head, body, [0, -0.043, 0.032], [0.087, 0.077, 0.079]);
    ellipsoid(head, body, [0, 0.02, 0.1], [0.024, 0.042, 0.022]);
    ellipsoid(head, body, [-0.103, 0.005, 0], [0.019, 0.033, 0.018]);
    ellipsoid(head, body, [0.103, 0.005, 0], [0.019, 0.033, 0.018]);
    const shorts = new THREE.Group();
    torso.add(shorts);
    shorts.add(
      contour(
        [
          [-0.14, 0.2],
          [-0.1, 0.205],
          [0.015, 0.195],
          [0.055, 0.18],
        ],
        fabric,
        0.75,
      ),
    );
    const arms = [-1, 1].map((side) => {
      const shoulder = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 24, 18),
        body,
      );
      scene.add(shoulder);
      shoulder.castShadow = true;
      const upper = segment(body, 0.112, 0.33),
        lower = segment(body, 0.086, 0.3);
      scene.add(upper, lower);
      const joint = new THREE.Mesh(
        new THREE.SphereGeometry(0.071, 20, 14),
        body,
      );
      scene.add(joint);
      const hand = new THREE.Group();
      scene.add(hand);
      ellipsoid(hand, body, [0, -0.045, 0.005], [0.051, 0.085, 0.027]);
      for (let i = 0; i < 4; i++)
        ellipsoid(
          hand,
          body,
          [(i - 1.5) * 0.022, -0.108, 0],
          [0.011, 0.043, 0.012],
        );
      ellipsoid(
        hand,
        body,
        [side * 0.055, -0.05, 0.018],
        [0.019, 0.043, 0.019],
      );
      return { side, shoulder, upper, lower, joint, hand };
    });
    const legs = [-1, 1].map((side) => {
      const upper = segment(body, 0.17, 0.47),
        lower = segment(body, 0.115, 0.46),
        short = segment(fabric, 0.185, 0.2);
      scene.add(upper, lower, short);
      const knee = new THREE.Mesh(
        new THREE.SphereGeometry(0.095, 20, 16),
        body,
      );
      scene.add(knee);
      const foot = new THREE.Group();
      scene.add(foot);
      ellipsoid(foot, fabric, [0, 0.03, 0.055], [0.084, 0.065, 0.165]);
      ellipsoid(foot, sole, [0, -0.005, 0.065], [0.086, 0.025, 0.17]);
      return { side, upper, lower, short, knee, foot };
    });
    const barGroup = new THREE.Group();
    scene.add(barGroup);
    const metal = new THREE.MeshStandardMaterial({
      color: 0x43454b,
      roughness: 0.3,
      metalness: 0.8,
    });
    for (const x of [-0.85, 0.85]) {
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, 2.47, 16),
        metal,
      );
      post.position.set(x, 1.25, 0.025);
      post.castShadow = true;
      barGroup.add(post);
    }
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.027, 0.027, 1.76, 20),
      metal,
    );
    bar.rotation.z = Math.PI / 2;
    bar.position.set(0, 2.47, 0.025);
    barGroup.add(bar);
    const pool = Array.from({ length: 80 }, () => new THREE.Vector3());
    let cursor = 0;
    const pose = (x: number, y: number, z: number) =>
      pool[cursor++].set(x, y, z);
    let visible = true,
      time = Math.acos(1 - (2 * values.current.phase) / 100) / (Math.PI * 0.6),
      last = performance.now(),
      oldExercise = "",
      oldView = "",
      oldPhase = values.current.phase;
    const resize = new ResizeObserver(() => {
      const w = host.clientWidth,
        h = host.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    });
    resize.observe(host);
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
    });
    observer.observe(host);
    const onLost = (e: Event) => {
      e.preventDefault();
      setFailed(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    let frame = 0;
    function tick(now: number) {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (!visible || document.hidden) return;
      cursor = 0;
      const { exercise, playing, phase, view } = values.current;
      if (phase !== oldPhase) {
        time = Math.acos(1 - (2 * phase) / 100) / (Math.PI * 0.6);
        oldPhase = phase;
      }
      if (playing) time += dt;
      const u = (1 - Math.cos(time * Math.PI * 0.6)) / 2;
      if (exercise !== oldExercise || view !== oldView) {
        const low = exercise === "pushup" || exercise === "hollow";
        controls.target.set(0, low ? 0.46 : 1.2, 0);
        camera.position.set(
          view === "side" ? (low ? 3.7 : 4.7) : low ? 2.8 : 3.5,
          low ? 1.8 : 2.15,
          view === "side" ? 0.25 : low ? 2.7 : 4.3,
        );
        controls.update();
        oldExercise = exercise;
        oldView = view;
      }
      barGroup.visible = exercise === "pullup";
      for (const p of pecs) p.material = exercise === "pushup" ? muscle : body;
      let hip: V, neck: V;
      if (exercise === "pushup") {
        hip = pose(0, 0.28 + 0.2 * u, -0.2);
        neck = pose(0, 0.39 + 0.34 * u, 0.49);
      } else if (exercise === "pullup") {
        hip = pose(0, 1.32 + 0.4 * u, 0);
        neck = pose(0, 1.94 + 0.4 * u, 0);
      } else if (exercise === "squat") {
        hip = pose(0, 1.06 - 0.46 * u, -0.32 * u);
        neck = pose(0, 1.68 - 0.46 * u, -0.03 * u);
      } else {
        hip = pose(0, 0.24, 0);
        neck = pose(0, 0.38 + 0.015 * u, 0.58);
      }
      torso.position.copy(hip);
      torso.quaternion.setFromUnitVectors(
        Y,
        boneDirection.subVectors(neck, hip).normalize(),
      );
      if (exercise === "hollow") torso.rotateY(Math.PI);
      for (const a of arms) {
        const shoulder = pose(a.side * 0.28, neck.y - 0.07, neck.z);
        let wrist: V, bend: V;
        if (exercise === "pushup") {
          wrist = pose(a.side * 0.39, 0.115, 0.56);
          bend = pose(a.side * 0.5, 0, -1);
        } else if (exercise === "pullup") {
          wrist = pose(a.side * 0.48, 2.45, 0.025);
          bend = pose(a.side, 0, 0.2);
        } else if (exercise === "squat") {
          wrist = pose(a.side * 0.25, neck.y - 0.17, 0.42);
          bend = pose(a.side, 0.1, 1);
        } else {
          wrist = pose(a.side * 0.2, 0.56 + 0.015 * u, 1.13);
          bend = pose(a.side, 1, 0);
        }
        const joint = elbow(shoulder, wrist, bend, 0.33, 0.3, pose(0, 0, 0));
        a.shoulder.position.copy(shoulder);
        a.joint.position.copy(joint);
        pointBone(a.upper, shoulder, joint, 0.33);
        pointBone(a.lower, joint, wrist, 0.3);
        a.hand.position.copy(wrist);
        if (exercise === "pushup") {
          a.hand.rotation.set(-Math.PI / 2, 0, 0);
        } else if (exercise === "pullup") {
          a.hand.rotation.set(Math.PI / 2, 0, 0);
        } else {
          a.hand.quaternion.setFromUnitVectors(
            pose(0, -1, 0),
            boneDirection.subVectors(wrist, joint).normalize(),
          );
        }
      }
      for (const l of legs) {
        const start = pose(hip.x + l.side * 0.13, hip.y - 0.04, hip.z);
        let ankle: V, bend: V;
        if (exercise === "pushup") {
          ankle = pose(l.side * 0.14, 0.11, -1.03);
          bend = pose(0, -1, 0);
        } else if (exercise === "pullup") {
          ankle = pose(l.side * 0.13, 0.39 + 0.4 * u, -0.15);
          bend = pose(0, 0, 0.8);
        } else if (exercise === "squat") {
          ankle = pose(l.side * 0.23, 0.12, 0.08);
          bend = pose(0, 0, 1);
        } else {
          ankle = pose(l.side * 0.13, 0.46 + 0.015 * u, -0.87);
          bend = pose(0, 1, 0);
        }
        const knee =
          exercise === "pushup" || exercise === "hollow"
            ? pose(
                (start.x + ankle.x) / 2,
                (start.y + ankle.y) / 2,
                (start.z + ankle.z) / 2,
              )
            : elbow(start, ankle, bend, 0.47, 0.46, pose(0, 0, 0));
        pointBone(l.upper, start, knee, 0.47);
        pointBone(l.short, start, knee, 0.47);
        l.short.scale.y = 0.43;
        pointBone(l.lower, knee, ankle, 0.46);
        l.knee.position.copy(knee);
        l.foot.position.copy(ankle);
        l.foot.rotation.set(
          exercise === "pushup" ? -0.5 : exercise === "hollow" ? 0.5 : 0,
          0,
          0,
        );
      }
      controls.update();
      renderer.render(scene, camera);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      observer.disconnect();
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      for (const m of [body, muscle, fabric, sole, metal]) m.dispose();
      env.dispose();
      pmrem.dispose();
      renderer.dispose();
      host.replaceChildren();
    };
  }, []);
  return (
    <div className="scene-canvas" ref={mount}>
      {failed ? (
        <div className="scene-fallback">
          <img src="/assets/pullup.webp" alt="" />
          <p>
            {t(
              "العرض ثلاثي الأبعاد غير متاح على هذا الجهاز. تعليمات الحركة متاحة بجانبه.",
              "3D is unavailable on this device. Use the movement instructions alongside it.",
            )}
          </p>
        </div>
      ) : null}
    </div>
  );
}
