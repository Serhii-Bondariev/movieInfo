const API_KEY = "22640216-9faa-4f8c-8ad0-48fc559dba92";
const API_KEY_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
const API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";


getMovies(API_KEY_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  showMovies(respData);
}

function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  document.querySelector(".movies").innerHTML = "";

  data.films.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
            <div class="movie-cover-inner">
                    <img src="${movie.posterUrlPreview}"
                        class="movie-cover"
                        alt="${movie.nameRu}" 
                        >
                    <div class="movie__cover--darkend"></div>
                </div>
                <div class="movie-info">

                    <div class="movie-title">${movie.nameRu}</div>
                    <div class="movie-category">${movie.genres.map(
                      (genre) => `${genre.genre}`
                    )}
                    </div>
                    ${movie.rating &&`
                    
                    <div class="movie-average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>`}
                </div>
                `;

    movieEl.addEventListener("click", () => openModal(movie.filmId))
    moviesEl.appendChild(movieEl);
  });
}

const form = document.querySelector("form");
const search = document.querySelector(".header-search");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    search.value = "";
  }
});

// =====================MODAL===============================






const modalEl = document.querySelector(".modal");

async function openModal(Id) {
  const resp = await fetch(API_URL_MOVIE_DETAILS + Id, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  


  modalEl.classList.add("modal--show");
  document.body.classList.add("stop_scroll");

  modalEl.innerHTML = `
  <div class="modal__card">
    <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="Movie Poster" srcset="">
    <h2>
        <span class="modal__movie-title">Назва - ${respData.nameRu}</span>
        <span class="modal__movie-year"> - ${respData.year}</span>
    </h2>
    <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${respData.genres.map((genre) => `${genre.genre}`)}</li>
        ${respData.filmLength ? `<li class="modal__movie-runtime">Час - ${respData.filmLength} хвилин.</li>` : ''}
        <li>Сайт - <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
        <li class="modal__movie-overview">Опис - ${respData.description}</li>
    </ul>
    <button type="button" class="modal__button-close">Close</button>
  `;

  const btnClose = document.querySelector(".modal__button-close");
  btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
  modalEl.classList.remove("modal--show");
  document.body.classList.remove("stop_scroll");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModal();
  }
})

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
})