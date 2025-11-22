import AutoFillForm from "./pages/AutoFillForm";
import FaceVerification from "./pages/FaceVerification";
import HomePage from "./pages/Home";
import KYCSuccess from "./pages/KYCSuccess";
import KYCUpload from "./pages/KYCUpload";
import Language from "./pages/Language";

export default function App() {
  return (
    <div>
      <HomePage/>
      <Language/>
      <KYCUpload/>
      <FaceVerification/>
      <AutoFillForm/>
      <KYCSuccess/>
    </div>
  );
}
