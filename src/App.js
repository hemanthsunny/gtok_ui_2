import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { connect } from "react-redux";
import Routes from "routes/Routes";
import {
	getQuery,
	firestore,
	auth,
	update,
	timestamp
} from "./firebase_config";
import "./App.css";

import { CookieNotification, NoInternetNotification, LoadingComponent } from "components";
import { SetDbUser, SetUser, SetLoggedIn } from "store/actions";

export const AuthContext = React.createContext();

class App extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loading: true,
			user: null,
			dbUser: null,
			loggedIn: false
		}
	}

	componentDidMount() {
	  const { bindUser, bindLoggedIn, bindDbUser } = this.props;
		auth.onAuthStateChanged(async (user) => {
			const isAuthenticated = user != null;
			if (isAuthenticated) {
				bindUser(user.toJSON());
				bindLoggedIn(true);
				user.getIdToken().then(async (accessToken) => {
					window.sessionStorage.setItem("token", accessToken);
					/* Get user details */
					let currentUser = user.toJSON();
					let orgUser = await getQuery(
						firestore.collection('users').where("email", "==", currentUser.email).get()
					);
					await update("users", orgUser[0].id, {lastSigninTime: timestamp});
					bindDbUser(orgUser[0]);
					this.setState({
						...this.state, loading: false
					})
				})
			} else {
				this.setState({
					...this.state, loading: false
				})
			}
		});
	}

	render() {
		return (
			this.state.loading ? <div><LoadingComponent /></div> :
				<div>
					<CookieNotification />
					<NoInternetNotification />
					<Router>
						<Routes />
					</Router>
				</div>
		)
	}
}

const mapStateToProps = (state) => {
	const { currentUser, dbUser, loggedIn } = state.authUsers;
	return { currentUser, dbUser, loggedIn };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindUser: (content) => dispatch(SetUser(content)),
		bindDbUser: (content) => dispatch(SetDbUser(content)),
		bindLoggedIn: (content) => dispatch(SetLoggedIn(content))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(App);

// class App extends Component {
// 	constructor(props) {
// 		super(props);
// 		this.state = {
// 			questions: [],
// 			comments: [],
// 			isLoggedIn: false
// 		}
// 	}

// 	componentDidMount() {
// 		this.displayQuestions();
// 	}

// 	handleChange = (event) => {
// 		this.setState({
// 			[event.target.name]: event.target.value
// 		})
// 	}

// 	displayQuestions = async () => {
// 		let qs = await get('questions');
// 		this.setState({
// 			...this.state,
// 			questions: qs
// 		})
// 	}

// 	saveQuestion = async () => {
// 		let question = {
// 			text: this.state.question_text
// 		}
// 		await add('questions', question);
// 		this.setState({
// 			...this.state,
// 			question_text: ''
// 		});
// 		this.displayQuestions();
// 	}

// 	deleteQuestion = async (e, id) => {
// 		await remove('questions', id);
// 		this.displayQuestions();
// 	}

// 	viewComments = async (e, qId) => {
// 		if (!qId) {
// 			qId = this.state.qId
// 		}
// 		let query = firestore.collection('comments').where("qId", "==", qId).get();
// 		let cs = await getQuery(query);
// 		console.log("coms", cs)
// 		this.setState({
// 			...this.state,
// 			qId,
// 			comments: cs
// 		})
// 	}

// 	saveComment = async () => {
// 		let comment = {
// 			text: this.state.comment_text,
// 			qId: this.state.qId
// 		}
// 		await add('comments', comment)
// 		this.viewComments();
// 	}

// 	displayCommentsUI = () => (
// 		<div>
// 	  	<div className="d-flex align-items-center mt-2">
// 		  	<textarea className="comment_box" name="comment_text" rows="2" onChange={this.handleChange} placeholder="Your comment here..."></textarea>
// 		  	<button className="btn btn-secondary btn-sm ml-2" onClick={this.saveComment} title="Save comment">
// 		  		<i className="fa fa-arrow-up"></i>
// 		  	</button>
// 	  	</div>
// 	  	{
// 	  		this.state.comments.map((c, idx) => (
// 					<div key={idx}>
// 						<small>{moment(c.createdAt).fromNow()}</small>
// 						<h6>{c.text}</h6>
// 					</div>
// 	  		))
// 	  	}
//   	</div>
// 	)

// 	beforeRender() {
// 		return (
// 		  <div className="container-fluid">
// 	  		<div className="d-flex align-items-center mt-2">
// 			  	<textarea className="col-10 question_box" name="question_text" rows="3" onChange={this.handleChange} placeholder="Type your requirements (separated by comma)"></textarea>
// 			  	<button className="btn btn-secondary btn-sm ml-2" onClick={this.saveQuestion}>
// 			  		Save
// 			  	</button>
// 	  		</div>
// 		  	<div className="display_questions">
// 		  		{this.state.questions.map((que, idx) => (
// 				  	<div key={idx} className="d-flex align-items-center mt-2">
// 		  				<div>
// 		  					<small>{moment(que.createdAt).fromNow()}</small>
// 		  					<h6>{que.text}</h6>
// 		  				</div>
// 		  				<button className="btn btn-secondary btn-sm ml-2" onClick={e => this.viewComments(e, que.id)} title="Show comments">
// 		  					<i className="fa fa-eye"></i>
// 		  				</button>
// 					  	<button className="btn btn-danger btn-sm ml-2" onClick={(e) => this.deleteQuestion(e, que.id)} title="Delete question">
// 					  		<i className="fa fa-trash"></i>
// 					  	</button>
// 		  			</div>
// 		  		))}
// 		  	</div>
// 		  	{
// 		  		this.state.qId ? (this.displayCommentsUI()): ''
// 		  	}
// 		  </div>
// 		);
// 	}

// 	render = () => {
// 	  return (
// 	    <AuthContext.Provider value={ this.state.isLoggedIn }>
// 	      Is logged in? {JSON.stringify(this.state.isLoggedIn)}
// 	      <div className="App">
// 	        <Router>
// 	          <Switch>
// 	            {routes.map(route => (
// 	              <Route
// 	                key={route.path}
// 	                path={route.path}
// 	                exact={route.exact}
// 	                component={route.main}
// 	              />
// 	            ))}
// 	          </Switch>
// 	        </Router>
// 	      </div>
// 	    </AuthContext.Provider>
// 	  );
// 	}
// }
