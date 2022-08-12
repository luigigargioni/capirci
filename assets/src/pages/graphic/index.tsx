import React, { memo } from 'react'
import { Header } from '../../components/Header'
import { GraphicWrapper } from './index.style'
import { Library } from './library'
import { Workspace } from './workspace'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import 'antd/dist/antd.css'

const GraphicPage = () => (
  <>
    <Header />
    <GraphicWrapper>
      <DndProvider backend={HTML5Backend}>
        <Library />
        <Workspace />
      </DndProvider>
    </GraphicWrapper>
  </>
)

export default memo(GraphicPage)
