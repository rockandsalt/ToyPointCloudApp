import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";

function App() {
  return (
    <div id="canvas-container" className="canvas-container">
      <Canvas flat linear>
        <OrbitControls />
        <gridHelper args={[10, 10]} />
      </Canvas>
    </div>
  );
}

export default App;
