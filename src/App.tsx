import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { JobList } from './pages/JobList';
import { Auth } from './pages/Auth';
import { Account } from './pages/Account';
import { Profile } from './pages/Profile';
import { CreateOffer } from './pages/CreateOffer';
import { Favorites } from './pages/Favorites';
import { Messages } from './pages/Messages';
import { Settings } from './pages/Settings';
import { Admin } from './pages/Admin';
import { OwnerPresentation } from './pages/OwnerPresentation';
import { Chatbot } from './pages/Chatbot';
import { Modele } from './pages/Modele';

// HashRouter works better for GitHub Pages without server rewrites
const Router = import.meta.env.PROD ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lista/:tip" element={<JobList />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cont" element={<Account />} />
          <Route path="/profil/:id" element={<Profile />} />
          <Route path="/creeaza" element={<CreateOffer />} />
          <Route path="/favorite" element={<Favorites />} />
          <Route path="/mesaje" element={<Messages />} />
          <Route path="/setari" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/prezentare" element={<OwnerPresentation />} />
          <Route path="/ajutor" element={<Chatbot />} />
          <Route path="/modele" element={<Modele />} />
        </Route>
      </Routes>
    </Router>
  );
}
