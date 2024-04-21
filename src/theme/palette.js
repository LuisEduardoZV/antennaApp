// material-ui
import { createTheme } from '@mui/material/styles'

// assets
import defaultColor from '../assets/scss/_themes-vars.module.scss'

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (navType) => {
  const colors = defaultColor

  return createTheme({
    palette: {
      mode: navType,
      common: {
        black: colors.darkPaper
      },
      primary: {
        light: navType === 'dark' ? colors.darkPrimaryLight : colors.primaryLight,
        main: navType === 'dark' ? colors.darkPrimaryMain : colors.primaryMain,
        dark: navType === 'dark' ? colors.darkPrimaryDark : colors.primaryDark,
        200: navType === 'dark' ? colors.darkPrimary200 : colors.primary200,
        800: navType === 'dark' ? colors.darkPrimary800 : colors.primary800
      },
      secondary: {
        light: navType === 'dark' ? colors.darkSecondaryLight : colors.secondaryLight,
        main: navType === 'dark' ? colors.darkSecondaryMain : colors.secondaryMain,
        dark: navType === 'dark' ? colors.darkSecondaryDark : colors.secondaryDark,
        200: navType === 'dark' ? colors.darkSecondary200 : colors.secondary200,
        800: navType === 'dark' ? colors.darkSecondary800 : colors.secondary800,
        contrastText: navType === 'dark' ? colors.darkPaper : colors.paper
      },
      error: {
        light: colors.errorLight,
        main: colors.errorMain,
        dark: colors.errorDark
      },
      orange: {
        light: colors.orangeLight,
        main: colors.orangeMain,
        dark: colors.orangeDark
      },
      rose: {
        light: colors.roseLight,
        main: colors.roseMain,
        dark: colors.roseDark
      },
      warning: {
        light: colors.warningLight,
        main: colors.warningMain,
        dark: colors.warningDark
      },
      success: {
        light: navType === 'dark' ? colors.successLight : colors.successDarkLight,
        200: navType === 'dark' ? colors.success200 : colors.successDark200,
        main: navType === 'dark' ? colors.successMain : colors.successDarkMain,
        dark: navType === 'dark' ? colors.successDark : colors.successDarkDark,
        800: colors.success800
      },
      grey: {
        50: colors.grey50,
        100: colors.grey100,
        500: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
        600: navType === 'dark' ? colors.darkTextTitle : colors.grey900,
        700: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
        900: navType === 'dark' ? colors.darkTextPrimary : colors.grey900
      },
      dark: {
        light: colors.darkTextPrimary,
        main: colors.darkLevel1,
        dark: colors.darkLevel2,
        800: colors.darkBackground,
        900: colors.darkPaper
      },
      text: {
        primary: navType === 'dark' ? colors.darkTextPrimary : colors.grey700,
        secondary: navType === 'dark' ? colors.darkTextSecondary : colors.grey500,
        dark: navType === 'dark' ? colors.darkTextPrimary : colors.grey900,
        hint: colors.grey100
      },
      divider: navType === 'dark' ? colors.darkTextPrimary : colors.grey200,
      background: {
        paper: navType === 'dark' ? colors.darkPaper : colors.paper,
        default: navType === 'dark' ? colors.darkBackground : colors.paper
      }
    }
  })
}

export default Palette
