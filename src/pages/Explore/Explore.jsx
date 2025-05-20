import React, { useState } from 'react'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'

const Explore = () => {
  const [category,setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
    <div className='container'>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className='input-group mb-3'>
              <select onChange={(e) => setCategory(e.target.value)} className='form-select mt-2' style={{'maxWidth': '200px'}}>
                <option value="All">All</option>
                <option value="Biryani">Biryani</option>
                <option value="Burger">Burger</option>
                <option value="Pizza">Pizza</option>
                <option value="Pasta">Pasta</option>
                <option value="Cola">Cola</option>
                <option value="Cake">Cake</option>
              </select>

              <input onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm} type="text" className="form-control mt-2" placeholder='Search Your Food...' />
              <button className='btn btn-primary mt-2' type='submit'>
                <i className='bi bi-search'></i>
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
    <FoodDisplay category={category} searchTerm={searchTerm}/>
    </>
  )
}

export default Explore