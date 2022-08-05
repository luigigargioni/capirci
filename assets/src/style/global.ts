import { createGlobalStyle } from 'styled-components'
import { ThemeType } from './theme'

export const GlobalStyle = createGlobalStyle<{ theme: ThemeType }>`

  html, body {
    margin: 0;
    padding: 0;
  }

  body {
    overflow: hidden;
    background-color: ${(p) => p.theme.colors.neutral.gray4};
  }

  .ant-layout {
    background: unset;
  }

  *::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  *::-webkit-scrollbar-track {
    background: ${(p) => p.theme.colors.neutral.gray3};
  }

  *::-webkit-scrollbar-thumb {
    background: ${(p) => p.theme.colors.neutral.gray5};
    border-radius: 8px;

    :hover {
      background: ${(p) => p.theme.colors.neutral.gray6};
    }
  }
`
