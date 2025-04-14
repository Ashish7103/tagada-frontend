import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
// import LoanDashboard from '../src/components/MoneyLenderComponent/DashBoard/DashBoard';
import SignUp from "../src/components/LoginPage/SignupPage"
import ProfilePage from './components/ProfilePage/newprofilepage';
import SignIn from './components/LoginPage/SigninPage';
// import LoanDashboard from './components/MoneyLenderComponent/MoneyLender';
import LoanDashboard from './components/MoneyLenderComponent/LoanDashboard';
import PersonalInformation from './components/MoneyLenderComponent/PersonalInformation';
import AddAreaComponent from './components/MoneyLenderComponent/AddAreaComponent';
import QrCodeScanner from './components/MoneyLenderComponent/QrCodeScanner';
import LoanTable from './components/MoneyLenderComponent/LoanTable';
import ChartsSection from './components/MoneyLenderComponent/ChartsSection';
import AddNewLoan from './components/MoneyLenderComponent/AddNewLoan';
import DownloadComponent from './components/MoneyLenderComponent/report';

//////////////////////////////////////////
import PersonalInformationLoanTaker from './components/ProfilePage/PersonalInformation';
import ReliabilityChart from './components/ProfilePage/ReliabilityChart';
import LoanHistory from './components/ProfilePage/LoanHistory';
///////////////////////////////////////////
import TagadaApp from './components/Home/TagadaApp';

function App() {
  return (
    <Router>
      <Routes>
        {/* Root route (optional) */}
       
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />


        {/* Admin route */}
        <Route path="/admin" element={<LoanDashboard />} />
        <Route path="/payment-trend" element={<ChartsSection />} />
        <Route path="/personal-information" element={<PersonalInformation />} />
        <Route path="/areas" element={<AddAreaComponent />} />
        <Route path="/scan-and-pay" element={<QrCodeScanner />} />
        <Route path="/overview" element={<LoanTable />} />
        <Route path="/add-loan" element={<AddNewLoan/>} />
        <Route path="/download" element={<DownloadComponent/>} />

        

        {/* user profile */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/profile-information" element={<PersonalInformationLoanTaker/>} />
        <Route path="/profile/relibility" element={<ReliabilityChart/>} />
        <Route path="/profile/loanOverview" element={<LoanHistory/>} />
        
{/* Tagada main */}
<Route path="/" element={<TagadaApp/>} />
        {/* 404 route (optional) */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
