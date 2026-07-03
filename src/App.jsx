import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import LevelSelect from './pages/LevelSelect'
import StoryList from './pages/StoryList'
import StoryReader from './pages/StoryReader'
import WhatsYomunusa from './pages/WhatsYomunusa'
import AboutUs from './pages/AboutUs'

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/level" element={<LevelSelect />} />
          <Route path="/level/:level" element={<StoryList />} />
          <Route path="/story/:slug" element={<StoryReader />} />
          <Route path="/whats-yomunusa" element={<WhatsYomunusa />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
