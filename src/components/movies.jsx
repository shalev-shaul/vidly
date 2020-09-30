import React, { Component } from "react";
import { getMovies, deleteMovie } from "../services/movieService";
import MoviesTable from "./moviesTable";
import Pagination from "./common/Pagination";
import Filter from "./common/Filter";
import { paginate } from "../utils/paginate";
import { getGenres } from "../services/genreService";

import _ from "lodash";
import { Link } from "react-router-dom";

import SearchBox from "./common/SearchBox";
import { toast } from "react-toastify";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    pageSize: 4,
    currectPage: 1,
    currectGanre: "",
    searchQuery: "",
    selectedGenre: null,
    sortColumn: {
      path: "title",
      order: "asc",
    },
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ name: "All Genres" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies, genres });
  }
  handleDelete = async (id) => {
    const originalMovies = this.state.movies;

    const movies = originalMovies.filter((movie) => movie._id !== id);
    this.setState({ movies });

    try {
      await deleteMovie(id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie is already deleted");

      this.setState({ movies: originalMovies });
    }
  };

  handleFilter = (f) => {
    this.setState({ currectGanre: f, searchQuery: "", currectPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, selectedGenre: null, currectPage: 1 });
  };

  handlePageChange = (page) => {
    this.setState({ currectPage: page });
  };

  handleLike = (movie) => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].like = !movies[index].like;
    this.setState({ movies });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPagedData = () => {
    const {
      movies: allMovies,
      currectPage,
      pageSize,
      selectedGenre,
      searchQuery,
      sortColumn,
    } = this.state;

    let filtered = allMovies;
    if (searchQuery)
      filtered = allMovies.filter((m) =>
        m.title.toLowerCase().startsWith(searchQuery.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter((m) => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currectPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };
  render() {
    const { totalCount, data: movies } = this.getPagedData();
    if (this.state.movies.length === 0)
      return <p>There are no movies in the database.</p>;

    const { searchQuery, currectGanre, sortColumn } = this.state;
    const { user } = this.props;
    return (
      <React.Fragment>
        <p>Showing {totalCount} movies in the database</p>
        <div className="row">
          <div className="col-3">
            <Filter
              currectGanre={currectGanre}
              genres={this.state.genres}
              onFilter={this.handleFilter}
            />
          </div>
          <div className="col">
            {user && (
              <Link to="/movies/new" className="btn btn-primary mb-3">
                New Movie
              </Link>
            )}
            <SearchBox value={searchQuery} onChange={this.handleSearch} />
            <MoviesTable
              movies={movies}
              sortColumn={sortColumn}
              onSort={this.handleSort}
              onLike={this.handleLike}
              onDelete={this.handleDelete}
            />

            <Pagination
              onPageChange={this.handlePageChange}
              currectPage={this.state.currectPage}
              itemsCount={totalCount}
              pageSize={this.state.pageSize}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Movies;
