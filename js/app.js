// Змінні для API ключів та URL запитів
const API_KEY = "22640216-9faa-4f8c-8ad0-48fc559dba92";
const API_KEY_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

// Виклик функції отримання популярних фільмів при завантаженні сторінки
getMovies(API_KEY_POPULAR);

// Асинхронна функція отримання фільмів з API
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

// Функція для визначення класу оцінки фільму
function getClassByRate(vote) {
  if (vote >= 7) {
    return "green";
  } else if (vote > 5) {
    return "orange";
  } else {
    return "red";
  }
}

// Функція для відображення фільмів на сторінці
function showMovies(data) {
  const moviesEl = document.querySelector(".movies");

  // Очистка контейнера перед відображенням нових фільмів
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
        <div class="movie-average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
      </div>
    `;
    moviesEl.appendChild(movieEl);
  });
}

// Отримання форми та поля для пошуку
const form = document.querySelector("form");
const search = document.querySelector(".header-search");

// Обробник події для пошуку фільмів
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);

    // Очищення поля для пошуку після відправлення запиту
    search.value = "";
  }
});

