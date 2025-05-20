import React, { useState } from 'react'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Home = () => {
  const [category,setCategory] = useState('All');

  return (
    <main>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory}  />
      <FoodDisplay category={category} searchTerm={''}/>
    </main>
  )
}

export default Home