import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import HeaderComponent from './header';
import { getId } from "firebase_config";
import { capitalizeFirstLetter } from "helpers";

function ProfileComponent(props) {
	const { currentUser, singleUserRelations, purchaseOrders } = props;
	const [ user, setUser ] = useState(currentUser);
	const userId = props.computedMatch.params.user_id;
	const walletCurrency = "INR";

	const purchaseFound = purchaseOrders.find(order => (order.profileUserId === userId && order.purchaseOrderStatus === "active"));

	useEffect(() => {
		async function getUser() {
			let u = await getId("users", userId);
			u = Object.assign(u, { id: userId });
			setUser(u);
		}
		if (userId) getUser();
	}, [userId]);


	return (
    <div style={{background: "rgba(0,0,0,0.01)"}}>
      <HeaderComponent userId={userId} currentUserId={currentUser.id} />
  	  <div className="container profile-wrapper">
        <div className="card container profile-card">
          <div className="media profile-body">
            <div className="media-body">
              <div className="profile-header">{user && capitalizeFirstLetter(user.displayName)}</div>
              <div className="profile-description">{user.bio}</div>
            </div>
            <img src={user.photoURL} className="profile-pic align-items-end" alt="Edit" />
          </div>
          <div className="row profile-info">
						<div className="col-4">
							<div className="info-name">Followed</div>
							<div className="info-value">
								<img src={require(`assets/svgs/Save.svg`)} className="save-icon" alt="Save" />
							</div>
						</div>
            <div className="col-4">
              <div className="info-name">Followers</div>
              <div className="info-value">
                <Link to="/app/search">{singleUserRelations.length}</Link>
              </div>
            </div>
            <div className="col-4">
              <div className="info-name">Following</div>
              <div className="info-value">0</div>
            </div>
          </div>
        </div>
				<div className="card posts-wrapper my-2">
					<div className="p-3">
						<Link to={`/app/profile/${userId || currentUser.id}/posts`} className="d-flex align-items-center">
							<img src={require(`assets/svgs/Plus.svg`)} className="posts-icon pull-left" alt="Posts" />
							<span className="option-name col-8">Posts</span>
							<img src={require(`assets/svgs/RightArrow.svg`)} className="right-icon col-3" alt="RightArrow" />
						</Link>
					</div>
					<div className="card-footer">
						{
							userId && (userId !== currentUser.id) ?
							(
								purchaseFound ?
								<div className="posts-footer text-center text-success">
									Successfully unlocked {user.displayName} premium posts
								</div>
								:
								<Link to={`/app/profile/${userId}/unlock_profile`} className="posts-footer">
									Unlock {user.displayName} premium posts <img src={require(`assets/svgs/RightArrow.svg`)} className="right-icon" alt="RightArrow" />
								</Link>
							) :
							<Link to={`/app/profile/${currentUser.id}/add_price`} className="posts-footer">
								Set price to premium posts <img src={require(`assets/svgs/RightArrow.svg`)} className="right-icon" alt="LeftArrow" />
							</Link>
						}
					</div>
				</div>
				<div className={`card p-3 wallet-wrapper my-2 ${userId && (userId !== currentUser.id) && "d-none"}`}>
					<Link to={`/app/profile/${currentUser.id}/wallet`} className="d-flex">
						<img src={require(`assets/svgs/Payments.svg`)} className="wallet-icon pull-left" alt="Payments" />
						<span className="option-name col-8">Wallet <small>(in {walletCurrency})</small></span>
					</Link>
				</div>
        <div className="row my-3 posts-wrapper d-none">
          <div className="col-6">
            <Link to="/app/profile">
              <div className="card card-feelings">
                <div className="card-name">
                  Feelings
                </div>
                <div>
                  <img src={require(`assets/svgs/Mike.svg`)} className="feelings-icon" alt="Edit" />
                </div>
              </div>
            </Link>
          </div>
          <div className="col-6">
            <Link to="/app/profile">
              <div className="card card-activities">
                <div className="card-name">
                  Activities
                </div>
                <div>
                  <img src={require(`assets/svgs/DailyActivities.svg`)} className="activities-icon" alt="Activities" />
                </div>
              </div>
            </Link>
          </div>
        </div>
        <div className="card card-badges my-3 d-none">
          <div className="row">
            <div className="col-8 card-name">
              Badges <br/> <span className="badges-count">0 <small>left</small></span>
            </div>
            <div className="col-4 text-center">
              <img src={require(`assets/svgs/BadgesActive.svg`)} className="badge-icon" alt="Badges" />
            </div>
          </div>
        </div>
        <div className="row my-3 badges-wrapper d-none">
          <div className="col-6">
            <Link to="/app/profile/purchase_badges">
              <div className="card card-purchase">
                <span className="card-name">Purchase badges</span>
              </div>
            </Link>
          </div>
          <div className="col-6">
            <Link to="/app/profile/redeem_badges">
              <div className="card card-redeem">
                <span className="card-name">Redeem badges</span>
              </div>
            </Link>
          </div>
        </div>
        <Link to="/app/challenges" className="d-none">
          <div className="card card-challenges">
            <div className="row">
              <div className="col-8 card-name">
                Trophies <br/> <span className="trophies-count">0</span>
              </div>
              <div className="col-4 text-center">
                <img src={require(`assets/svgs/Challenge.svg`)} className="challenge-icon" alt="Challenge" />
              </div>
            </div>
          </div>
        </Link>
  		</div>
    </div>
	);
}

const mapStateToProps = (state) => {
	const { singleUserRelations } = state.relationships;
	const { purchaseOrders } = state.purchaseOrders;
	return { singleUserRelations, purchaseOrders };
}

export default connect(
	mapStateToProps,
	null
)(ProfileComponent);
