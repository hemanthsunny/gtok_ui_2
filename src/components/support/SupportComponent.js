import React from "react";
import { Link } from "react-router-dom";

const SupportComponent = ({currentUser}) => {
	return (
		<div className="container-fluid font-xs-small">
			<h4 className="text-center text-secondary py-2">How our app works?</h4>
			<div id="accordion">
			  <div className="card">
			    <div className="card-header" id="headingOne">
		        <button className="btn btn-link" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
		          Step 1 : Home page
		        </button>
			    </div>
			    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
			      	Write and share about yourself in <Link to="/app/home"> home </Link> page. Can, even, generate a post by answering questions.
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingTwo">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
		          Step 2 : Search page
		        </button>
			    </div>
			    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
			      	You can search and find people here. Also, you can find similarities in various categories with others. <Link to="/app/search">Search</Link> here.
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingThree">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
		          Step 3 : Chat page
		        </button>
			    </div>
			    <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
			      	You can chat with others based on similarities. Lets get to know each other by saying 'Hi!'.
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingFour">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
		          Step 4 : Profile page
		        </button>
			    </div>
			    <div id="collapseFour" className="collapse" aria-labelledby="headingFour" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
			      	In profile page, you can update your profile information. You cannot edit email and date of birth. If you wish to update email or date of birth, send us a mail at <span className="btn btn-link p-0"> letsgtok@gmail.com</span>
			      </div>
			    </div>
			  </div>
			  <div className="card">
			    <div className="card-header" id="headingFive">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
		          Step 5 : Manage permissions
		        </button>
			    </div>
			    <div id="collapseFive" className="collapse" aria-labelledby="headingFive" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
			      	You can manage your permissions in <Link to="/app/profile">profile</Link> page. You can set permissions like who can see your profile, similarities etc.
			      </div>
			    </div>
			  </div>
			{/*
			  <div className="card">
			    <div className="card-header" id="headingSix">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
		          Gtok bot
		        </button>
			    </div>
			    <div id="collapseSix" className="collapse" aria-labelledby="headingSix" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
			      	Gtok bot is an Artificial Intelligence bot where you can chat, follow, search, answer similarity questions in a simple way. Gtok bot can talk to you and helps you at anytime. Currently, GTOK bot is unavailable in Beta version.
			      </div>
			    </div>
			  </div>
			*/}
			  <div className="card">
			    <div className="card-header" id="headingSeven">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
		          Any queries / Contact us
		        </button>
			    </div>
			    <div id="collapseSeven" className="collapse" aria-labelledby="headingSeven" data-parent="#accordion">
			      <div className="card-body p-4 text-justify text-secondary">
							We are always happy to listen your feedback or queries. Drop us an email at <span className="btn btn-link p-0"> letsgtok@gmail.com </span>
			      </div>
			    </div>
			  </div>
			{/*
			  <div className="card">
			    <div className="card-header" id="headingThree">
		        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#stepThree" aria-expanded="true" aria-controls="stepThree">
		          Step 3 : Find your similarity score with others
		        </button>
			    </div>
			    <div id="stepThree" className="collapse show" aria-labelledby="headingThree" data-parent="#accordion">
			      <div className="card-body">
			      	<b>What is GTOK similarity score?</b><br/>
			      	GTOK similarity score is a score which you will get after filling surveys. <br/>
			      	<b>How this score helps?</b><br/>
			      	You can find similarities between you and a stranger. If you find a similarity with others, you can chat each other and share opinions directly. <br/>
			      	<b>How will we find similarities?</b><br/>
			      	Our Artificial Intelligence algorithm will do it for us. It computes similarity score on 12 different categories (See categories list). Each category has a max score of 100 points, which means you can score a maximum of 1200 points in total. <br/>
			      	<b>How similarity score helps?</b><br/>
			      	Similarity score helps you to connect and understand others in a better way. You can find similarity scores with Friends, Colleagues, Partners, Strangers, Neighbors and so forth. Here are few examples -
			      	<ul>
			      		<li>If you are a fresher in college, its hard to find friends in your interests. Then, you can easily search for GTOK similarity score and start finding friends.</li>
			      		<li>If you are looking for a partner. Then, you can easily search GTOK similarity score before you start dating.</li>
			      		<li>If you started recently a new job. Then, you can easily search GTOK similarity score to find your Colleagues that interests you.</li>
			      		<li>If you moved to a new place with your family. Then, you can easily search GTOK similarity score with your neighbors and start doing friendship.</li>
			      		<li>If you are an employer who wants to hire an individual. Then, you can easily search GTOK similarity score before you hire a candidate.</li>
			      		<li>If you are an entrepreneur who wants to work with similar mindset. Then, GTOK similarity score perfectly suits you.</li>
			      	</ul><br/>
			      	<b>Lets GTOK each other and live happily.</b>			      	
			      </div>
			    </div>
			  </div>
			*/}
			</div>
		</div>
	)
}

export default SupportComponent;