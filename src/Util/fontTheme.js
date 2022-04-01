import { createTheme } from '@mui/material/styles';

const fontTheme = createTheme({
    typography: {
      allVariants: {
        fontFamily: `'Tajawal', sans-serif;`,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500
      },
    },
    
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'Tajawal', sans-serif;;
            font-style: normal;
          }
        `,
      },
    },
});

export default fontTheme;