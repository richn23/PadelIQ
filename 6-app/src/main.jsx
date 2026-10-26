import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Admin from './screens/Admin.jsx';
import './styles.css';

// ?admin opens the skills framework editor (for Richard and coaches), not the player app.
const isAdmin = new URLSearchParams(location.search).has('admin');
if (isAdmin) document.body.classList.add('admin-mode');
createRoot(document.getElementById('root')).render(isAdmin ? <Admin /> : <App />);
