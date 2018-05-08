import React, { Component } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/js/libs/stats.min.js';
import * as dat from 'three/examples/js/libs/dat.gui.min.js';

class Chapter2 extends Component {
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
        // this.scene.fog = new THREE.Fog(0xffffff, 0.015, 100); // 안개 설정 - 선형적으로 증가함
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

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(-40, 60, -10);
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);

        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(this.scene.position);

        // add subtle ambient lighting
        this.ambientLight = new THREE.AmbientLight(0x0c0c0c);
        this.scene.add(this.ambientLight);

        const _this = this;
        this.controls = new function () {
            this.rotationSpeed = 0.02;
            this.numberOfObjects = _this.scene.children.length;
            this.removeCube = function () {
                const allChildren = _this.scene.children;
                const lastObject = allChildren[allChildren.length - 1];
                if (lastObject instanceof THREE.Mesh) {
                    _this.scene.remove(lastObject);
                    this.numberOfObjects = _this.scene.children.length;
                }
            };
            this.addCube = function () {
                const cubeSize = Math.ceil((Math.random() * 3));
                const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
                const cubeMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                cube.castShadow = true;
                cube.name = "cube-" + _this.scene.children.length;
                // position the cube randomly in the scene
                console.log(planeGeometry.parameters.width, planeGeometry.parameters.height);
                cube.position.x = -30 + Math.round((Math.random() * planeGeometry.parameters.width));
                cube.position.y = Math.round((Math.random() * 5));
                cube.position.z = -20 + Math.round((Math.random() * planeGeometry.parameters.height));
                // add the cube to the scene
                _this.scene.add(cube);
                this.numberOfObjects = _this.scene.children.length;
            };
            this.outputObjects = function () {
                console.log(_this.scene.children);
            }
        };

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
        this.gui = new dat.GUI();
        this.gui.add(this.controls, 'rotationSpeed', 0, 0.5);
        this.gui.add(this.controls, 'addCube');
        this.gui.add(this.controls, 'removeCube');
        this.gui.add(this.controls, 'outputObjects');
        this.gui.add(this.controls, 'numberOfObjects').listen();
    }

    renderScene = () => {
        // 통계 그래프
        this.stats.update();
        // 정육면체 회전
        this.scene.traverse((e) => {
            if (e instanceof THREE.Mesh && e !== this.plane) {
                e.rotation.x += this.controls.rotationSpeed;
                e.rotation.y += this.controls.rotationSpeed;
                e.rotation.z += this.controls.rotationSpeed;
            }
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

export default Chapter2;
