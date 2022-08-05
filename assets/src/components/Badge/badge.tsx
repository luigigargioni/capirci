import { Badge } from 'antd'
import React from 'react'

interface CustomBadgeProps {
  count: number
  children: JSX.Element
  onClick: () => void
}

export const CustomBadge = (p: CustomBadgeProps) => (
  <a href="#" onClick={p.onClick}>
    <Badge count={p.count} size="small" offset={[0, 10]} title="">
      {p.children}
    </Badge>
  </a>
)
