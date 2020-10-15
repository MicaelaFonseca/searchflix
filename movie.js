class MoviesList extends React.Component {
	state = {
		--> id de filme pré definido da omdb
		moviesList: ["tt0993846"], 
		searchTerm: ""
	};

	search = (event) => {
		event.preventDefault();
		axios
			.get(
				`https://www.omdbapi.com/?apikey=756abb2f&s=${this.state.searchTerm}&plot=full`
			)
			.then((res) => res.data)
			.then((res) => {
				if (!res.Search) {
					this.setState({ moviesList: [] });
					return;
				}

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

	render() {
		const { moviesList } = this.state;

		return (
			<div>
				<form onSubmit={this.search}>
					<input
						placeholder="Escreva o nome do realizador/ator"
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
					<p>Não foi encontrado nenhum filme. Por favor, tente novamente.</p>
				)}
			</div>
		);
	}
}

class MovieCard extends React.Component {
	state = {
		movieData: {}
	};

	componentDidMount() {
		axios
			.get(
				`https://www.omdbapi.com/?apikey=756abb2f&i=${this.props.movieID}&plot=full`
			)
			.then((res) => res.data)
			.then((res) => {
				this.setState({ movieData: res });
			});
	}

	render() {
		const {
			Title,
			Released,
			Genre,
			Actors,
			Poster,
			Director
		} = this.state.movieData;

		if (!Poster || Poster === "N/A") {
			return null;
		}

		return (
			<div className="movie-card-container">
				<div className="image-container">
					<div className="bg-image" style={{ backgroundImage: `url(${Poster})` }} />
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
