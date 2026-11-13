import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Shell } from './app/Shell';
import { Reader } from './features/bible/Reader';
import { About, BibleHome, Give, Home, NotFound, Saved, Search, Settings } from './routes/pages';
import { registerSW } from './sw';
import './styles.css';
import './pages.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Home />} />
          <Route path="bible" element={<BibleHome />} />
          <Route path="bible/:book/:chapter" element={<Reader />} />
          <Route path="search" element={<Search />} />
          <Route path="saved" element={<Saved />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="give" element={<Give />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);

registerSW();
