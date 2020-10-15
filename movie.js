class MoviesList extends React.Component {
	state = {
		// id de filme pré definido da omdb
		moviesList: ["tt2294629"],
		searchTerm: ""
	};

	search = (event) => {
		event.preventDefault();
		axios
			.get(
				`https://www.omdbapi.com/?apikey=96b4735e&s=${this.state.searchTerm}&plot=full`
			)
      // API TMDB para pesquisa por ator/realizador : https://api.themoviedb.org/3/search/person?api_key=a824278551831cda575306a80c1d3ded&search_type=ngram&query=${this.state.searchTerm}`
			// A resposta JSON era recebida, no entanto esta abordagem não foi usada porque não retornava os valores corretos, como alternativa optei pela utilização da https OMDB para pesquisa por filme.
			.then((res) => res.data)
			.then((res) => {
				if (!res.Search) {
					this.setState({ moviesList: [] });
					return;
				}
        // retorna lista de filmes se resposta JSON 200 e com resultados
				const moviesList = res.Search.map((movie) => movie.imdbID);
				this.setState({
					moviesList
				});
			});
	};

	handleChange = (event) => {
		this.setState({
			searchTerm: event.target.value
		});
	};

	render() { // o método render é chamado para contruir a view do componente
		const { moviesList } = this.state;

		return (
			<div>
				<form onSubmit={this.search}>
					<input // textbox para pesquisa por filmes
						placeholder="Escreva o nome do filme"
						onChange={this.handleChange}
					/>
					<button type="submit">
						<i className="fa fa-search" />
					</button>
				</form>
				<form>
				</form>
				{moviesList.length > 0 ? (
					moviesList.map((movie) => <MovieCard movieID={movie} key={movie} />)
				) : (
					<p> Por favor, tente novamente.</p>
				)}
			</div>
		);
	}
}

class MovieCard extends React.Component {
	state = {
	movieData: {}
	};

	componentDidMount() { // invocado após o render para chamar a API
		axios
			.get( //https por id
				`https://www.omdbapi.com/?apikey=96b4735e&i=${this.props.movieID}&plot=full`
			)
			.then((res) => res.data)
			.then((res) => {
				this.setState({ movieData: res });
			});
	}

	render() {
		const { // parâmetros a ser "retirados" do JSON
			Title,
			Released,
			Genre,
			Actors,
			Poster,
			Director
		} = this.state.movieData;

		if (!Poster || Poster === "N/A") { // se n tiver retorna null
			return null;
		}

		return (
			<div className="movie-card-container"> //"agrupar" os dados a serem apresentados
				<div className="image-container">
					<div className="bg-image" style={{ backgroundImage: `url(${Poster})` }} /> //poster
				</div>
				<div className="movie-info">
					<h2>{Title}</h2>
					<div>
						<h4>Data de lançamento: </h4>
						<small> {Released}</small>
						<h4>Diretor: </h4>
						<small> {Director} </small>
						<h4>Atores: </h4>
						<small> {Actors} </small>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(<MoviesList />, document.getElementById("app"));
