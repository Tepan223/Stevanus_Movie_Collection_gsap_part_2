import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./App.css"; 

const App = () => {
  const [movies, setMovies] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("Spiderman");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    if (!searchTerm.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please enter a movie name!",
      });
      return;
    }
  
    setLoading(true);
    try {
      const response = await axios.get(`https://imdb.iamidiotareyoutoo.com/search?q=${searchTerm}`);
      setMovies(response.data.description); 
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Failed to fetch movies. Please try again later.",
      });
      setMovies([]);
    } finally {
      setLoading(false); 
    }
  };
  
  const handleSearch = () => {
    fetchMovies();  
  };

  return (
    <div className="app">
      <h1>Movie Collection</h1>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter movie name"
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie['#IMG_POSTER']} alt={movie.title} />
              <h2>{movie['#TITLE']}</h2>
              <div className="name">
                <p>{movie['#YEAR']}</p>
                <p>#{movie['#RANK']}</p>
              </div>
              <p>Cast: {movie['#ACTORS']}</p>
            </div>
          ))
        ) : (
          !loading && <p className="Text">No movies found. Try another search!</p>
        )}
      </div>
    </div>
  );
};

export default App;