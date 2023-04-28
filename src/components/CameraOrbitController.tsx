import { useThree } from "@react-three/fiber"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useEffect } from "react";
const CameraOrbitController = () => {
    // gl是全局渲染器对象
    const { camera, gl } = useThree()
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement)
        return () => {
            controls.dispose()
        }
    }, [camera, gl]);
    return null
}
export default CameraOrbitController