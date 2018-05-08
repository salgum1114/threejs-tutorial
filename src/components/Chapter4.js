import React, { Component } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/js/libs/stats.min.js';
import * as dat from 'three/examples/js/libs/dat.gui.min.js';
import SceneUtils from '../SceneUtils';

export default class Chapter4 extends Component {
    constructor(props) {
        super(props);
        this.step = 0;
    }

    componentDidMount() {
        this.init();
        window.addEventListener('resize', this.onResize, false);
    }

    componentWillUnmount() {
        document.getElementsByClassName('dg ac')[0].removeChild(this.gui.domElement);
    }

    onResize = () => {
        this.camera.aspect = this.container.parentElement.clientWidth / this.container.parentElement.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.parentElement.clientWidth, this.container.parentElement.clientHeight);
    }

    init = () => {
        this.stats = this.initStats(); // 통계 그래프 초기화
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.01); // 안개 설정 - 거리에 따라 밀도가 기하 급수적으로 커짐
        // 장면의 모든 객체는 overrideMaterial에 설정된 물질을 따라가며, 객체 자신에 설정된 물질을 무시한다.
        this.scene.overrideMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        this.camera = new THREE.PerspectiveCamera(45, this.container.parentElement.clientWidth / this.container.parentElement.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xEEEEEE, 1.0);
        this.renderer.setSize(this.container.parentElement.clientWidth, this.container.parentElement.clientHeight);
        this.renderer.shadowMap.enabled = true; // renderer에게 그림자가 필요함을 알림

        const planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 광원을 제공하는 물질
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotateX(-0.5 * Math.PI);
        this.plane.position.set(0, 0, 0);
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);

        this.camera.position.set(-20, 25, 20);
        this.camera.lookAt(new THREE.Vector3(5, 0, 0));

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(-40, 60, 10);
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);

        const vertices = [
            new THREE.Vector3(1, 3, 1),
            new THREE.Vector3(1, 3, -11),
            new THREE.Vector3(1, -1, 1),
            new THREE.Vector3(1, -1, -1),
            new THREE.Vector3(-1, 3, -1),
            new THREE.Vector3(-1, 3, 1),
            new THREE.Vector3(-1, -1, -1),
            new THREE.Vector3(-1, -1, 1),
        ];

        const faces = [
            new THREE.Face3(0, 2, 1),
            new THREE.Face3(2, 3, 1),
            new THREE.Face3(4, 6, 5),
            new THREE.Face3(6, 7, 5),
            new THREE.Face3(4, 5, 1),
            new THREE.Face3(5, 0, 1),
            new THREE.Face3(7, 6, 2),
            new THREE.Face3(6, 3, 2),
            new THREE.Face3(5, 7, 0),
            new THREE.Face3(7, 2, 0),
            new THREE.Face3(1, 3, 4),
            new THREE.Face3(3, 6, 4),
        ];

        const geometry = new THREE.Geometry();
        geometry.vertices = vertices;
        geometry.faces = faces;
        geometry.computeFaceNormals();

        const materials = [
            new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0x44ff44, transparent: true }),
            new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
        ];

        this.mesh = SceneUtils.createMultiMaterialObject(geometry, materials);
        this.mesh.children.forEach((e) => {
            e.castShadow = true;
        });

        this.scene.add(this.mesh);

        const addControl = (x, y, z) => {
            const controls = new function () {
                this.x = x;
                this.y = y;
                this.z = z;
            };
            return controls;
        };

        this.controlPoints = [];
        this.controlPoints.push(addControl(3, 5, 3));
        this.controlPoints.push(addControl(3, 5, 0));
        this.controlPoints.push(addControl(3, 0, 3));
        this.controlPoints.push(addControl(3, 0, 0));
        this.controlPoints.push(addControl(0, 5, 0));
        this.controlPoints.push(addControl(0, 5, 3));
        this.controlPoints.push(addControl(0, 0, 0));
        this.controlPoints.push(addControl(0, 0, 3));

        // dat.GUI 초기화
        this.initDatGUI();
        document.getElementById('three').appendChild(this.renderer.domElement);
        this.renderScene();
    }

    initStats = () => {
        const stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '200px';
        stats.domElement.style.top = '0px';
        document.getElementById('stats').appendChild(stats.domElement);
        return stats;
    }

    initDatGUI = () => {
        const _this = this;
        this.gui = new dat.GUI();
        this.gui.add(new function () {
            this.clone = function () {
                const clonedGeometry = _this.mesh.children[0].geometry.clone();
                const materials = [
                    new THREE.MeshLambertMaterial({ opacity: 0.6, color: 0xff44ff, transparent: true }),
                    new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true }),
                ];
                const mesh = SceneUtils.createMultiMaterialObject(clonedGeometry, materials);
                mesh.children.forEach((e) => {
                    e.castShadow = true;
                });
                mesh.translateX(5);
                mesh.translateZ(5);
                mesh.name = 'clone';
                _this.scene.remove(_this.scene.getObjectByName('clone'));
                _this.scene.add(mesh);
            }
        }, 'clone');

        for (let i = 0; i < 8; i++) {
            const f1 = this.gui.addFolder(`Vertices ${i + 1}`);
            f1.add(this.controlPoints[i], 'x', -10, 10);
            f1.add(this.controlPoints[i], 'y', -10, 10);
            f1.add(this.controlPoints[i], 'z', -10, 10);
        }
    }

    renderScene = () => {
        // 통계 그래프
        this.stats.update();
        const vertices = [];
        for (let i = 0; i < 8; i++) {
            vertices.push(new THREE.Vector3(this.controlPoints[i].x, this.controlPoints[i].y, this.controlPoints[i].z));
        }
        this.mesh.children.forEach((e) => {
            e.geometry.vertices = vertices;
            e.geometry.verticesNeedUpdate = true;
            e.geometry.computeFaceNormals();
        });
        requestAnimationFrame(this.renderScene);
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (
            <div ref={(c) => { this.container = c; }} style={{ width: '100%', height: '100%' }}>
                <div id="three" style={{ width: '100%', height: '100%' }} />
                <div id="stats" />
            </div>
        );
    }
}
