//URL
const apikey = 'api_key=22348bf6f06376a691526e655159ce80';
const base_url = 'https://api.themoviedb.org/3';
const api_url = base_url + '/discover/movie?' + apikey;
const search_url = base_url + '/search/movie?' + apikey;
const img_url = 'https://image.tmdb.org/t/p/w500';

//HTML
const main = document.getElementById('main');
const search = document.getElementById('search');
const form = document.getElementById('form');
const lmao = document.getElementById('top');

const prev = document.getElementById('prev');
const current = document.getElementById('current');
const next = document.getElementById('next');

//VAR
var current_page = 1;
var next_page = 2;
var prev_page = 3;
var last_url = '';
var total_pages = 100;

//SHOW MOVIES
getMovies(api_url);

async function getMovies(url){
    last_url = url;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (data.results.length !== 0){
        showMovies(data.results);
        current_page = data.page;
        next_page = current_page + 1;
        prev_page = current_page - 1;
        total_pages = data.total_pages;

        current.innerText = current_page;
        if (current_page <= 1){
            prev.classList.add('disabled');
            next.classList.remove('disabled');

            prev.classList.remove('invisible');
            next.classList.remove('invisible');
            current.classList.remove('invisible');
        }else if(current_page >= total_pages){
            prev.classList.remove('disabled');
            next.classList.add('disabled');

            prev.classList.remove('invisible');
            next.classList.remove('invisible');
            current.classList.remove('invisible');
        }else{
            prev.classList.remove('disabled');
            next.classList.remove('disabled');

            prev.classList.remove('invisible');
            next.classList.remove('invisible');
            current.classList.remove('invisible');
        }
        lmao.scrollIntoView({behavior : 'smooth'});
    }else {
        main.innerHTML = `<h1 class="no_result">No Results Found :(</h1>`;
        //invisible
        prev.classList.add('invisible');
        next.classList.add('invisible');
        current.classList.add('invisible');
    }

}

function showMovies(data){
    main.innerHTML = '';

    data.forEach(movie => {
        const {id, poster_path, title, vote_average, overview} = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <div class="card">
                <div class="movie_info">
                    <img src="${img_url+poster_path}" alt="${title}">
                    <div class="info">
                        <h3>${title}</h3>
                        <span class="${getColor(vote_average)}">${vote_average}</span>
                    </div>
                </div>
                <div class="overview">
                    <h3>Overview</h3>
                    <div class="text">${overview}</div>
                </div>
            </div>
        `

        main.appendChild(movieEl);
    });
}

function getColor(vote){
    if (vote >= 8){
        return 'green';
    }else if (vote >= 5){
        return 'orange';
    }
    else{
        return 'red';
    }
}

//SEARCH
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const search_term = search.value;
    if(search_term){
        getMovies(search_url+'&query='+search_term);
    }else{
        getMovies(api_url)
    }
})

//PAGINATION
prev.addEventListener('click', () => {
    if (prev_page > 0){
        page_call(prev_page);
    }
})

next.addEventListener('click', () => {
    if (next_page <= total_pages){
        page_call(next_page);
    }
})

function page_call(page){
    let url_split = last_url.split('?');
    let query_params = url_split[1].split('&');
    let key = query_params[query_params.length - 1].split('=');
    if (key[0] !== 'page'){
        let url = last_url + '&page=' + page;
        getMovies(url);
    }else {
        key[1] = page.toString();
        let a = key.join('=');
        query_params[query_params.length - 1] = a;
        let b = query_params.join('&');
        let url = url_split[0] + '?' + b;
        getMovies(url);
    }
}

