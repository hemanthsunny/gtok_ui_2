import React, { useState, useEffect } from "react";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton, LinkedinIcon, LinkedinShareButton
} from "react-share";

import { NotificationComponent } from "components";
import { SetSharePost } from "store/actions";
import { HelmetMetaDataComponent, DisplayPostComponent, LoadingComponent } from "components";
import { gtokBot } from "images";

const SharePostComponent = (props) => {
	const { sharePost, currentUser, bindSharePost } = props;
	const [result, setResult ] = useState("");
	const [copied, setCopied ] = useState(false);
	let postId = props.match.params.id;
	let sharePostUrl = "https://beta.letsgtok.com/app/posts/"+props.match.params.id;

	useEffect(() => {
		if (!sharePost || !sharePost.id) {
			bindSharePost(currentUser, "id", {id: postId});
		}
	}, [bindSharePost, sharePost, currentUser, postId]);

  const copyLink = () => {
  	navigator.clipboard.writeText(sharePostUrl);
  	setCopied(true);
  	setTimeout(() => {
  		setCopied(false);
  	}, 1500);
  }

  const copiedLinkAlert = () => (
  	<div className="page-top-alert"> Link Copied </div>
  );

	return sharePost && sharePost.id ? (
		<div className="container">
	  	<div className="row">
	    	<div className="col-xs-12 col-md-9 px-0">
					<div className="container pt-3">
			    	{copied && copiedLinkAlert() }
						{result.status && <NotificationComponent result={result} setResult={setResult}/>}
						<HelmetMetaDataComponent currentUrl={sharePostUrl} title={sharePost.category.title} description={sharePost.text} />
						<DisplayPostComponent currentUser={currentUser} post={sharePost} setResult={setResult} hideShareBtn={true} />
						<div className="d-flex flex-row justify-content-center">
						  <div className="copy-link-icon" onClick={copyLink}>
						  	<i className="fa fa-link pt-2 pl-2"></i>
						  </div>
						  <FacebookShareButton url={sharePostUrl} title={sharePost.category.title} quote={sharePost.text} hashtag="#letsgtok" className="socialMediaButton">
						  	<FacebookIcon size={36}/>
						  </FacebookShareButton>
							<TwitterShareButton url={sharePostUrl} title={sharePost.text} hashtags="#letsgtok" className="socialMediaButton">
					     <TwitterIcon size={36} />
					   </TwitterShareButton>
					   <WhatsappShareButton url={sharePostUrl} title={sharePost.text} separator=":: " className="socialMediaButton">
					     <WhatsappIcon size={36} />
					   </WhatsappShareButton>
					   <LinkedinShareButton url={sharePostUrl} title={sharePost.text} summary={sharePost.category.title} source="Lets Gtok" className="socialMediaButton">
					     <LinkedinIcon size={36} />
					   </LinkedinShareButton>
					  </div>
				  </div>
				</div>
	    	<div className="d-none col-md-3 d-md-block mt-2">
	    		<div className="card right-sidebar-wrapper">
	    			<div className="card-body">
							<div className="d-flex profile-bot">
								<img src={gtokBot} alt="gtokBot" className="bot-icon" />
								<small className="bot-text">Your personal friend</small>
							</div>
							<hr/>
							<p className="profile-bot-description">
								Hi! I am your personal friend (a bot). I can chat, work and help you in daily activities. I am so happy to be your personal friend, {currentUser.displayName.split(" ")[0].toUpperCase()}. Will ping you once I am ready to chat...
							</p>
	    			</div>
	    		</div>
	    	</div>
			</div>
		</div>
	) : <LoadingComponent />
}

const mapStateToProps = (state) => {
	const { sharePost } = state.posts;
	return { sharePost };
}

const mapDispatchToProps = (dispatch) => {
	return {
		bindSharePost: (content, type, data) => dispatch(SetSharePost(content, type, data))
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withRouter(SharePostComponent));