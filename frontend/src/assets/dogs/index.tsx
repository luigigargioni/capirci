import React from 'react'
import { getFromLocalStorage, LocalStorageKey } from 'utils/localStorageUtils'
import icon1 from './1.png'
import icon2 from './2.png'
import icon3 from './3.png'
import icon4 from './4.png'
import icon5 from './5.png'
import icon6 from './6.png'
import icon7 from './7.png'
import icon8 from './8.png'
import icon9 from './9.png'

export const RandomDogIcon = () => {
  const icons = [icon1, icon2, icon3, icon4, icon5, icon6, icon7, icon8, icon9]
  const token = getFromLocalStorage(LocalStorageKey.TOKEN)

  // Get the last number of the token
  const numbersArray = token.match(/[0-8]/g) || [0]
  const randomIndex = Number(numbersArray[numbersArray.length - 1])
  const randomIcon = icons[randomIndex]

  return <img src={randomIcon} alt="icon" width="100%" />
}
