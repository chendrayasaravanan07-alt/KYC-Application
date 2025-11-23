import AutoFillForm from "./pages/AutoFillForm";
import ErrorPage from "./pages/ErrorPage";
import FaceVerification from "./pages/FaceVerification";
import HomePage from "./pages/Home";
import KYCSuccess from "./pages/KYCSuccess";
import KYCUpload from "./pages/KYCUpload";
import Language from "./pages/Language";
import LoanRiskReport from "./pages/LoanRiskReport";

export default function App() {
  return (
    <div>
      <HomePage/>
      <Language/>
      {/* <KYCUpload/> */}
      {/* <FaceVerification/>
      <AutoFillForm/> */}
      {/* <LoanRiskReport/> */}
      <KYCSuccess/>
      <ErrorPage/>
      
    
    </div>
  );
}
