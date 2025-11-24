// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { API_ENDPOINTS } from "../util/baseURL";
// import type { City, Movie } from "../types/cinemaTypes"

// //for now I am using dummy data
// import dummy_movies from "../data/dummy_movies.json"
// import MovieBanner from "../components/MovieBanner";

// const MoviesPage: React.FC = () => {
//   const navigate = useNavigate();

//   const [cities, setCities] = useState<City[]>([]);
//   const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
//   const [searchText, setSearchText] = useState("");
//   const [selectedTitle, setSelectedTitle] = useState<string>(""); // movie title filter
//   const [selectedCity, setSelectedCity] = useState<string>(""); // city_uid
//   const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD

//   const [showings, setShowings] = useState<ShowingRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string>("");

//   return (
//   <>
//     <h1>Movies Page</h1>
//     <MovieBanner uid='123' title='123' duration_minutes={154} poster_url="xxx" release_year={1998}  />
//   </>
//   ) 
    
// }

// export default MoviesPage;