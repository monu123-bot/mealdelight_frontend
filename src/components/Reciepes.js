import React, { useEffect, useState } from 'react';
import RecipeCard from './ReciepeCard';
import '../style/Reciepies.css';
import { host } from '../script/variables';
import { Search } from 'lucide-react'; // nice search icon

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
      <h2 className="recipes-title">🍴 Explore Healthy Keto Recipes</h2>

      <div className="search-bar">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search recipes by name or category..."
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <p className="no-results">No recipes found 😔</p>
      )}
    </div>
  );
};

export default Reciepes;
