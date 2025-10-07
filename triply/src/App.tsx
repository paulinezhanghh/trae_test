import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, responsiveFontSizes } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import PlanPage from './pages/PlanPage';
import ItineraryPage from './pages/ItineraryPage';

// Components
import ResponsiveAppBar from './components/layout/ResponsiveAppBar';
import OfflineIndicator from './components/layout/OfflineIndicator';
import SkipLink from './components/layout/SkipLink';

// Context
import { TripProvider } from './contexts/TripContext';

// Create theme
let theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: {
            xs: 16,
            sm: 24
          },
          paddingRight: {
            xs: 16,
            sm: 24
          }
        }
      }
    }
  },
});

// Make fonts responsive
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TripProvider>
          <BrowserRouter>
            <SkipLink contentId="main-content" />
            <ResponsiveAppBar />
            <main id="main-content" tabIndex={-1} style={{ outline: 'none' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/plan" element={<PlanPage />} />
                <Route path="/itinerary" element={<ItineraryPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <OfflineIndicator />
          </BrowserRouter>
        </TripProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
