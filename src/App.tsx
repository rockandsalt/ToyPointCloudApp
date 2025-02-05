import { Canvas, useThree, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import "./App.css";
import { PCDLoader } from "three/examples/jsm/Addons.js";
import {
  PointsMaterial,
  Box3,
  Vector3,
  PerspectiveCamera
} from "three";
import { useEffect, useMemo, useRef, useState } from "react";

function PointCloudModel(prop: { filePath: string }) {
  const result = useLoader(PCDLoader, prop.filePath);
  const material = useMemo(() => new PointsMaterial({ color: "red" }), []);
  const camera = useThree((state) => state.camera);

  useEffect(() => {
    // set camera so that fov is adjusted to fit the object
    const perspectiveCam = camera as PerspectiveCamera;
    const boundingBox = new Box3().setFromObject(result);
    const center = boundingBox.getCenter(new Vector3());
    const size = boundingBox.getSize(new Vector3());

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = perspectiveCam.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

    camera.position.set(center.x, center.y, cameraZ);
    camera.lookAt(center);
    camera.updateProjectionMatrix();
  }, [result, camera]);

  return <points geometry={result.geometry} material={material} />;
}

function App() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileUrl(URL.createObjectURL(file));
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  return (
    <div id="canvas-container" className="canvas-container">
      <button className="open-file-button" onClick={handleButtonClick}>
        Open File
      </button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        title="Choose a PCD file"
        onChange={handleFileChange}
      />
      <Canvas flat linear camera={{ position: [10, 10, 10] }}>
        <OrbitControls />
        {fileUrl ? <PointCloudModel filePath={fileUrl} /> : <gridHelper />}
      </Canvas>
    </div>
  );
}

export default App;
