import React, { memo } from 'react'
import { Header } from '../../components/Header'
import { GraphicWrapper } from './index.style'
import { Library } from './library'
import { Workspace } from './workspace'
import 'antd/dist/antd.css'

const GraphicPage = () => (
  <>
    <Header />
    <GraphicWrapper>
      <Library />
      <Workspace />
    </GraphicWrapper>
  </>
)

export default memo(GraphicPage)
