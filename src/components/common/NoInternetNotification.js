import React, { useState, useEffect } from "react";

const NoInternetNotification = () => {
	const [ online, setOnline] = useState(navigator.onLine);

	useEffect(() => {
		if (!online) { setOnline(false) }
	}, [online]);

	return (
		<div className={`notification alert fade show alert-danger ${online && "d-none"}`}>
			No Internet
		</div>
	);
}

export default NoInternetNotification;