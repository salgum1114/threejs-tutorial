import React, { Component } from 'react';
import * as THREE from 'three';
import Stats from 'three/examples/js/libs/stats.min.js';

class Chapter1 extends Component {
    constructor(props) {
        super(props);
        this.step = 0;
    }

    componentDidMount() {
        this.init();
        window.addEventListener('resize', this.onResize, false);
    }

    onResize = () => {
        this.camera.aspect = this.container.parentElement.clientWidth / this.container.parentElement.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.container.parentElement.clientWidth, this.container.parentElement.clientHeight);
    }

    init = () => {
        this.stats = this.initStats();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, this.container.parentElement.clientWidth / this.container.parentElement.clientHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(0xEEEEEE, 1.0);
        this.renderer.setSize(this.container.parentElement.clientWidth, this.container.parentElement.clientHeight);
        this.renderer.shadowMap.enabled = true; // renderer에게 그림자가 필요함을 알림

        const axes = new THREE.AxesHelper(20);
        this.scene.add(axes);

        const planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        // const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc }); // 기본 물질은 광원에 대해 아무런 반응도 하지 않음
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // 광원을 제공하는 물질
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);
        this.plane.rotateX(-0.5 * Math.PI);
        this.plane.position.set(15, 0, 0);
        this.plane.receiveShadow = true;
        this.scene.add(this.plane);

        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
        // const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
        const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.cube.position.set(-4, 3, 0);
        this.cube.castShadow = true;
        this.scene.add(this.cube);

        const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
        // const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x7777ff, wireframe: true });
        const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.sphere.position.set(20, 4, 2);
        this.sphere.castShadow = true;
        this.scene.add(this.sphere);

        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(-40, 60, -10);
        this.spotLight.castShadow = true;
        this.scene.add(this.spotLight);

        this.camera.position.set(-30, 40, 30);
        this.camera.lookAt(this.scene.position);

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

    renderScene = () => {
        // 통계 그래프
        this.stats.update();
        // 정육면체 회전
        this.cube.rotation.x += 0.02;
        this.cube.rotation.y += 0.02;
        this.cube.rotation.z += 0.02;
        // 공 바운싱
        this.step += 0.04;
        this.sphere.position.x = 20 + (10 * (Math.cos(this.step)));
        this.sphere.position.y = 2 + (10 * (Math.abs(Math.sin(this.step))));
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

export default Chapter1;
