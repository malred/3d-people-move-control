import { Canvas } from "@react-three/fiber"
// import CameraOrbitController from "../components/CameraOrbitController";
import { OrbitControls, Stats, useTexture } from "@react-three/drei";
import Lights from "../components/Lights";
import Ground from "../components/Ground";
import GrilModel from "../components/Gril";
function Home() {
  const testing = true
  return (
    <div className="container">
      <Canvas shadows >
        {testing ? <Stats /> : null}
        {/* 坐标轴,args表示轴的长度 */}
        {testing ? <axesHelper args={[2]} /> : null}
        {/* 显示网格,args是尺寸 x*y */}
        {testing ? <gridHelper args={[10, 10]} /> : null}
        <OrbitControls />
        {/* @ts-ignore */}
        <GrilModel />
        <Lights />
        <Ground />
      </Canvas>
    </div>
  )
};
export default Home;