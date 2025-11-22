import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#22d3ee'
    },
    secondary: {
      main: '#0ea5e9'
    },
    background: {
      default: '#0f151c',
      paper: '#111827'
    },
    text: {
      primary: '#f9fafb',
      secondary: '#9ca3af'
    },
    divider: 'rgba(31,41,55,1)'
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.7rem',
      letterSpacing: 1
    },
    h5: {
      fontWeight: 600
    },
    h6: {
      fontWeight: 600
    },
    body2: {
      fontSize: '0.92rem'
    }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f151c',
          borderBottom: '1px solid rgba(31,41,55,1)',
          boxShadow: 'none'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#111827',
          border: '1px solid rgba(31,41,55,1)',
          boxShadow: 'none'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: '#111827',
          border: '1px solid rgba(31,41,55,1)',
          boxShadow: 'none'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          backgroundColor: '#0f172a',
          border: '1px solid rgba(55,65,81,1)',
          boxShadow: 'none'
        },
        label: {
          fontSize: '0.75rem'
        }
      }
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      }
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          position: 'relative',
          zIndex: 1
        }
      }
    }
  }
})

export default theme
