import * as THREE from 'three';

const SceneUtils = {
    createMultiMaterialObject: (geometry, materials) => {
        const group = new THREE.Group();
        for (let i = 0, l = materials.length; i < l; i++) {
            group.add(new THREE.Mesh(geometry, materials[i]));
        }
        return group;
    },
    detach: (child, parent, scene) => {
        child.applyMatrix(parent.matrixWorld);
        parent.remove(child);
        scene.add(child);
    },
    attach: (child, scene, parent) => {
        child.applyMatrix(new THREE.Matrix4().getInverse(parent.matrixWorld));
        scene.remove(child);
        parent.add(child);
    },
};

export default SceneUtils;
