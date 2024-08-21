import React from "react";
import { db } from "../../firebase";
import { useState, useEffect, useCallback } from "react";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { Link } from "react-router-dom";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [displayResults, setDisplayResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const fetchResults = useCallback(async () => {
    if (searchTerm.trim() === "") return;
    setLoading(true);
    setDisplayResults(true);
    const q = query(collection(db, "Assets"));
    const querySnapshot = await getDocs(q);
    const allResults = [];
    querySnapshot.forEach((doc) => {
      allResults.push({ id: doc.id, ...doc.data() });
    });
    const newResults = allResults
      .filter((result) =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 7);
    setResults(newResults);
    setLoading(false);
    setDisplayResults(searchTerm !== "");
  }, [searchTerm]);

  useEffect(() => {
    if (searchTerm !== "") {
      fetchResults();
    } else {
      setResults([]);
      setDisplayResults(false);
    }
  }, [searchTerm, fetchResults]);

  const handleSearchChange = debounce((e) => {
    setLoading(true);
    setSearchTerm(e.target.value);
  }, 1000);

  return (
    <>
      {overlay && (
        <div
          className="search_overlay"
          onClick={() => {
            const overlay = document.querySelector(".search_overlay");
            overlay.classList.add("fade");

            setTimeout(() => {
              setOverlay(false);
            }, 190);
          }}
        ></div>
      )}
      <div className={`search_main search ${overlay ? "active" : ""}`}>
        <div className={`search ${overlay ? "active" : ""}`}>
          <i className="icon fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Find more than 1000+ quality assets"
            id="search_input"
            onChange={handleSearchChange}
            onClick={() => {
              setDisplayResults(false);

              overlay ? "" : setOverlay(true);
            }}
          />

          {searchTerm ? (
            <i
              className="icon fa-solid fa-times"
              onClick={() => {
                document.querySelector("#search_input").value = "";
                setSearchTerm("");
                setResults([]);
              }}
            ></i>
          ) : (
            ""
          )}
        </div>

        {displayResults && (
          <div className="search_results">
            {results.map((result) => (
              <Link
                to={`/View/${result.id}`}
                onClick={() => {
                  setDisplayResults(false);
                  setSearchTerm("");
                  setOverlay(false);
                }}
              >
                <div className="result" key={result.id}>
                  <div className="image">
                    <img src={result.thumbnail} alt={result.title} />
                  </div>
                  <div className="details">
                    <h3 className="title">{result.title}</h3>
                    <p className="type">{result.type}</p>
                  </div>
                </div>
              </Link>
            ))}

            {loading && (
              <div className="loading">
                <span>Loading...</span>
              </div>
            )}

            {results.length === 0 && !loading && (
              <div className="no_results">
                <span>No results found</span>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
