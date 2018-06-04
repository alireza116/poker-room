import React, { Component } from 'react';
import io from 'socket.io-client';
import { getPlayer } from './store/clientPlayer';
import { connect } from 'react-redux';
import Seats from './seats';
import Actions from './playerActions';
import Board from './Board';
import SoundEffects from './SoundEffects';
import { setTimeout } from 'timers';

let socket;
const mapStateToProps = (state) => ({ state });
const mapDispatchToProps = (dispatch) => ({ getPlayer: (id) => dispatch(getPlayer(id)) });

class Test extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: '',
			gameState: {
				players: [],
				gameDeck: '',
				board: [],
				activeBet: 0
			},
			sound: 'none'
		};
		this.check = this.check.bind(this);
		this.fold = this.fold.bind(this);
		this.call = this.call.bind(this);
		this.bet = this.bet.bind(this);
		this.raise = this.raise.bind(this);
		socket = io.connect();
		socket.on('clientId', (id) => {
			this.setState({ id });
		});
		socket.on('gameState', (gameState) => {
			this.setState({ gameState });
		});
		socket.on('sound', (soundEffect) => {
			this.setState({sound: soundEffect})
			setTimeout(	() => {
				this.setState({sound: 'none'})
			}, 500)
		})
	}


	fold() {
		const action = { type: 'fold' };
		socket.emit('action', action);
	}

	check() {
		const action = { type: 'check' };
		socket.emit('action', action);
	}

	call() {
		const action = { type: 'call' };
		socket.emit('action', action);
	}

	bet() {
		const action = { type: 'bet' };
		socket.emit('action', action);
	}

	raise() {
		const action = { type: 'raise' };
		socket.emit('action', action);
	}

	render() {
		const players = this.state.gameState.players;
		const id = this.state.id;
		const clientPlayer = players.filter((player) => player.id === id);
		return (
			<div>
				<div className="container">
					<img src="poker_table.svg" />
					<SoundEffects sound={this.state.sound} />
					<Seats clientPlayer={clientPlayer} id={id} players={players} />
					<Actions
						raise={this.raise}
						bet={this.bet}
						call={this.call}
						fold={this.fold}
						clientPlayer={clientPlayer}
						check={this.check}
						activeBet={this.state.gameState.activeBet}
					/>
				</div>
				<p>Number of players: {players.length} </p>
				<Board pot={this.state.gameState.pot} players={players} board={this.state.gameState.board} />
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);
