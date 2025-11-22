import FaceVerification from "./pages/FaceVerification";
import HomePage from "./pages/Home";
import KYCUpload from "./pages/KYCUpload";
import Language from "./pages/Language";

export default function App() {
  return (
    <div>
      <HomePage/>
      <Language/>
      <KYCUpload/>
      <FaceVerification/>
    </div>
  );
}
