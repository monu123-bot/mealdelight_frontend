import React, { useEffect, useState } from 'react';
import RecipeCard from './ReciepeCard';
import '../style/Reciepies.css'; // Optional: for styling
import { host } from '../script/variables';

const Reciepes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${host}/tapi/ketorecepies`);
        const data = await response.json();
        setRecipes(data);
        setFilteredRecipes(data);
      } catch (error) {
        console.error('Failed to fetch recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = recipes.filter(
      recipe =>
        recipe.recipe.toLowerCase().includes(value) ||
        recipe.category.category.toLowerCase().includes(value)
    );
    setFilteredRecipes(filtered);
  };

  return (
    <div className="recipes-page">
      <h2>Explore Healthy Keto Recipes</h2>
      <input
        type="text"
        placeholder="Search by recipe name or category..."
        value={search}
        onChange={handleSearch}
        className="search-input"
      />

      <div className="recipes-grid">
        {filteredRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default Reciepes;
