import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import Onboarding from './pages/Onboarding.jsx'
import Calendar from './pages/Calendar.jsx'
import DayPage from './pages/DayPage.jsx'
import Diploma from './pages/Diploma.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import PublicOffer from './pages/PublicOffer.jsx'

const Placeholder = ({ text }) => {
  return (
    <Layout>
      <div className="container-center">
        <div className="card" style={{textAlign:'center'}}>
          <div className="title">{text}</div>
        </div>
      </div>
    </Layout>
  )
}

const Protected = ({ children }) => {
  const { loading, error, hasProfile } = useAuth()
  if (loading) return <Placeholder text="Загрузка" />
  if (error) return <Placeholder text={error} />
  if (!hasProfile) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/calendar" replace />} />
          <Route path="/onboarding" element={<Layout><Onboarding /></Layout>} />
          <Route path="/calendar" element={<Protected><Layout><Calendar /></Layout></Protected>} />
          <Route path="/day/:day" element={<Protected><Layout><DayPage /></Layout></Protected>} />
          <Route path="/diploma" element={<Protected><Layout><Diploma /></Layout></Protected>} />
          <Route path="/privacy" element={<Layout><PrivacyPolicy /></Layout>} />
          <Route path="/offer-public" element={<Layout><PublicOffer /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
