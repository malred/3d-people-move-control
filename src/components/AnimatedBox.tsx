import { MutableRefObject, useRef } from 'react'
import { useFrame } from "@react-three/fiber"
import { useHelper } from '@react-three/drei'
import { BoxHelper, Object3D } from 'three'
type Props = {
    isTesting: boolean
}
const AnimatedBox: React.FC<Props> = ({ isTesting }) => {
    const meshRef = useRef<MutableRefObject<Object3D<Event>>>(null)
    {
        isTesting ? useHelper(meshRef.current, BoxHelper, "blue") : null
    }
    // 每帧运行
    useFrame(() => {
        if (meshRef.current) {
            // @ts-ignore
            meshRef.current.rotation.x += 0.01
        }
    })
    return (
        // @ts-ignore
        <mesh ref={meshRef} scale={[0.5, 0.5, 0.5]}>
            {/* attach->子项添加到父项的哪个属性->mesh.geometry */}
            {/* attach会自动通过html标签的最后一个单词推断(boxGeometry->geometryeometry) */}
            <boxGeometry attach={'geometry'} />
            <meshStandardMaterial />
        </mesh>
    )
}
export default AnimatedBox