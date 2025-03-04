import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./App.css";
import gsap from "gsap";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("Spiderman");
  const [loading, setLoading] = useState(false);
  const searchButtonRef = useRef(null);

  useEffect(() => {
    fetchMovies();
    gsap.defaults({ duration: 0.2, ease: "power2.out" });
  }, []);

  const fetchMovies = async () => {
    if (!searchTerm.trim()) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Please Enter a Movie Name!",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://imdb.iamidiotareyoutoo.com/search?q=${searchTerm}`
      );
      setMovies(response.data.description || []);
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

  useEffect(() => {
    if (movies.length > 0) {
      animateMovies();
    }
  }, [movies]);

  const handleSearch = () => {
    if (searchButtonRef.current) {
      gsap.to(searchButtonRef.current, {
        scale: 0.7,
        duration: 0.1,
        onComplete: () => {
          gsap.to(searchButtonRef.current, {
            scale: 1,
            duration: 0.2,
            onComplete: fetchMovies,
          });
        },
      });
    } else {
      fetchMovies();
    }
  };

  const handleMouseEnter = () => {
    if (searchButtonRef.current) {
      gsap.killTweensOf(searchButtonRef.current);
      gsap.to(searchButtonRef.current, { scale: 1.2 });
    }
  };

  const handleMouseLeave = () => {
    if (searchButtonRef.current) {
      gsap.killTweensOf(searchButtonRef.current);
      gsap.to(searchButtonRef.current, { scale: 1 });
    }
  };

  const animateMovies = () => {
    gsap.from(".movie-card", {
      y: -50,
      opacity: 0,
      stagger: 0.1,
      scale: 1.5,
    });
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
        <button
          ref={searchButtonRef}
          onClick={handleSearch}
          disabled={loading}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p className="loading">Loading...</p>}

      <div className="movie-list">
        {movies.length > 0 ? (
          movies.map((movie, index) => (
            <div key={movie.id || index} className="movie-card">
              <img src={movie["#IMG_POSTER"]} alt={movie["#TITLE"]} />
              <h2>{movie["#TITLE"]}</h2>
              <div className="name">
                <p>{movie["#YEAR"]}</p>
                <p>#{movie["#RANK"]}</p>
              </div>
              <p>Cast: {movie["#ACTORS"]}</p>
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
