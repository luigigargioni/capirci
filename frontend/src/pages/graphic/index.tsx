import React from 'react'
import { useParams } from 'react-router-dom'

const Graphic = () => {
  const { id } = useParams()

  return (
    <div>
      <h1>Graphic: {id}</h1>
    </div>
  )
}

export default Graphic
