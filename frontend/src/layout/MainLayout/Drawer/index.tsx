import React, { useMemo } from 'react'
import { useTheme } from '@mui/material/styles'
import { Box, Drawer, useMediaQuery } from '@mui/material'

import { drawerWidth } from 'utils/constants'
import { DrawerHeader } from './DrawerHeader'
import { DrawerContent } from './DrawerContent'
import { MiniDrawerStyled } from './MiniDrawerStyled'

interface MainDrawerProps {
  open: boolean
  handleDrawerToggle: () => void
}

export const MainDrawer = ({ open, handleDrawerToggle }: MainDrawerProps) => {
  const theme = useTheme()
  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'))

  // responsive drawer container
  const container = window !== undefined ? window.document.body : undefined

  // header content
  const drawerContent = useMemo(() => <DrawerContent />, [])
  const drawerHeader = useMemo(() => <DrawerHeader open={open} />, [open])

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, zIndex: 1300 }}>
      {!matchDownLG ? (
        <MiniDrawerStyled variant="permanent" open={open} theme={theme}>
          {drawerHeader}
          {drawerContent}
        </MiniDrawerStyled>
      ) : (
        <Drawer
          container={container}
          variant="temporary"
          open={open}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: `1px solid ${theme.palette.divider}`,
              backgroundImage: 'none',
              boxShadow: 'inherit',
            },
          }}
        >
          {open && drawerHeader}
          {open && drawerContent}
        </Drawer>
      )}
    </Box>
  )
}
