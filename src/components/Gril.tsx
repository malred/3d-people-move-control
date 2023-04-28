import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF, useAnimations, OrbitControls } from "@react-three/drei";
import { useInput } from "../hooks/useInput";
import { useFrame, useThree } from "@react-three/fiber";
let walkDirection = new THREE.Vector3()
let rotateAngle = new THREE.Vector3(0, 1, 0)
let rotateQuarternion = new THREE.Quaternion()
let cameraTarget = new THREE.Vector3()
// 对角移动
type directions = {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
}
const directionOffset = ({ forward, backward, left, right }: directions) => {
    var directionOffset = 0
    if (forward) {
        // 向前+向左 -> 对角线移动
        if (left) {
            directionOffset = Math.PI / 4 // w+a
        } else if (right) {
            directionOffset = -Math.PI / 4
        }
    } else if (backward) {
        if (left) {
            directionOffset = Math.PI / 4 + Math.PI / 2
        } else if (right) {
            directionOffset = -Math.PI / 4 - Math.PI / 2
        } else {
            directionOffset = Math.PI
        }
    } else if (left) {
        directionOffset = Math.PI / 2
    } else if (right) {
        directionOffset = -Math.PI / 2
    }
    return directionOffset
}
type props = {
    modelName: string
}
const Model: React.FC<props> = ({ modelName = 'gril' }) => {
    const { forward, backward, left, right, shift, jump } = useInput()
    // const name = modelName ? modelName : 'gril'
    const model = useGLTF(
        // GLTFLoader,
        './models/' + modelName + '.glb'
    )
    const { actions } = useAnimations(model.animations, model.scene)
    // 缩放
    model.scene.scale.set(0.8, 0.8, 0.8)
    model.scene.traverse((obj) => {
        // @ts-ignore 
        if (obj.isMesh) {
            obj.castShadow = true
        }
    })
    // 当前动画
    const currentAction = useRef('')
    // 控制器
    const controlsRef = useRef<typeof OrbitControls>()
    // 相机
    const camera = useThree((state) => state.camera)
    // 更新相机的方法
    const updateCameraTarget = (moveX: number, moveZ: number) => {
        // move camera 
        camera.position.x += moveX
        camera.position.z += moveZ
        // update camera target
        cameraTarget.x = model.scene.position.x
        cameraTarget.y = model.scene.position.y + 2
        cameraTarget.z = model.scene.position.z
        // @ts-ignore
        if (controlsRef.current) controlsRef.current.target = cameraTarget
    }
    useEffect(() => {
        // actions?.jumping?.play();  
        let action = ''
        if (forward || backward || left || right) {
            action = 'walking'
            if (shift) {
                action = 'running'
            }
        } else if (jump) {
            action = 'jumping'
        } else {
            action = 'idel'
        }
        // 如果动作改变了
        if (currentAction.current != action) {
            // 改变当前动作
            const nextActionToPlay = actions[action]
            const current = actions[currentAction.current]
            current?.fadeOut(0.2)
            nextActionToPlay?.reset().fadeIn(0.2).play()
            currentAction.current = action
        }
    }, [forward, backward, left, right, shift, jump])
    useFrame((state, delta) => {
        // delta是单位时间
        if (currentAction.current == 'running' || currentAction.current == 'walking') {
            // 相机朝向
            let angleYCameraDirection = Math.atan2(
                camera.position.x - model.scene.position.x,
                camera.position.z - model.scene.position.z,
            )
            // 对角移动
            let newDirectionOffset = directionOffset({
                forward,
                backward,
                left,
                right
            })
            // 旋转模型
            rotateQuarternion.setFromAxisAngle(
                rotateAngle,
                angleYCameraDirection + newDirectionOffset
            )
            model.scene.quaternion.rotateTowards(rotateQuarternion, 0.2)
            // 计算方向
            camera.getWorldDirection(walkDirection)
            walkDirection.y = 0
            walkDirection.normalize()
            walkDirection.applyAxisAngle(rotateAngle, newDirectionOffset)
            // 移动速度
            const velocity = currentAction.current == 'running' ? 10 : 5
            // 移动model和相机
            const moveX = walkDirection.x * velocity * delta
            const moveZ = walkDirection.z * velocity * delta
            model.scene.position.x += moveX
            model.scene.position.z += moveZ
            updateCameraTarget(moveX, moveZ)
        }
    })
    return (<>
        {/* @ts-ignore */}
        <OrbitControls ref={controlsRef} />
        <primitive object={model.scene} />
    </>)
}
export default Model