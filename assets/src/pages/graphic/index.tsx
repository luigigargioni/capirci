import React, { memo } from 'react'
import { Header } from '../../components/Header'
import { GraphicWrapper } from './index.style'
import { DndArea } from './dndArea'
import 'antd/dist/antd.css'

const GraphicPage = () => (
  <>
    <Header />
    <GraphicWrapper>
      <DndArea />
    </GraphicWrapper>
  </>
)

export default memo(GraphicPage)
