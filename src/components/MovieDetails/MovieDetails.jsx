import { useState, useEffect } from "react";
import clsx from "clsx";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

import { fetchDetailsMovie } from "../../services/api";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import styles from "./MovieDetails.module.css";
import { defaultIMG } from "../../services/defaultIMG.js";

const buildStylesClasses = ({ isActive }) =>
  clsx(styles.link, isActive && styles.active);

const MovieDetails = ({ id }) => {
  const [detailsMovie, setDetailsMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  //location інформація про сторінку на які знаходимось
  const location = useLocation();
  // console.log(location.state.from);

  useEffect(() => {
    const fetchDetailsMoviesHandler = async () => {
      try {
        // Показуємо лоадер
        setLoading(true);
        const data = await fetchDetailsMovie(id);
        // console.log(data);
        setDetailsMovie(data);
      } catch (error) {
        setError(true);
        console.log(error.message);
      } finally {
        // Приховуємо лоадер
        setLoading(false);
      }
    };
    fetchDetailsMoviesHandler();
  }, [id]);

  //якщо перешли за скопійованим посиланням і немає данних про
  //попередню сторінку, то перейди на сторінку movies
  const backUrl = location.state?.from || "/movies";
  //location.state інформація про сторінку з якої перейшли
  const goBack = () => navigate(backUrl);

  return (
    <>
      <button className={styles.btn} onClick={goBack}>
        ⇐ Go back
      </button>
      {loading && <Loader />}
      {error ? (
        <ErrorMessage />
      ) : (
        <>
          <div className={styles.wrapImg}>
            <img
              className={styles.img}
              src={
                detailsMovie?.poster_path
                  ? `https://image.tmdb.org/t/p/w200${detailsMovie?.poster_path}`
                  : defaultIMG
              }
              alt={id.title}
            />
            <div className={styles.wrapInfo}>
              <h2 className={styles.title}>{detailsMovie?.title}</h2>
              <p className={styles.release}>
                Release:&nbsp;{detailsMovie?.release_date}
              </p>
              <p className={styles.rate}>
                User Score:&nbsp;
                {Math.round(detailsMovie?.vote_average * 10)}%
              </p>
              <h3 className={styles.overviewTitle}>Overview</h3>
              <p className={styles.overview}>{detailsMovie?.overview}</p>
              <h3 className={styles.genresTitle}>Genres</h3>
              <p className={styles.genres}>
                {detailsMovie?.genres.map((genre) => genre.name).join(" ")}
              </p>
            </div>
          </div>
          <div className={styles.moreInfo}>
            <h3 className={styles.moreInfoTitle}>Additional information</h3>
            <div className={styles.linksInfo}>
              <NavLink
                state={{ from: backUrl }}
                className={buildStylesClasses}
                to={`/movies/${id}/cast`}
              >
                Cast
              </NavLink>
              <NavLink
                state={{ from: backUrl }}
                className={buildStylesClasses}
                to={`/movies/${id}/reviews`}
              >
                Reviews
              </NavLink>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MovieDetails;
