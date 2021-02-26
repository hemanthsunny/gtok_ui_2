import React, { useState } from "react";

const SortComponent = (props) => {
	const [ toggleMenu, setToggleMenu ] = useState(false);
	const [ selectedOption, setSelectedOption ] = useState(props.options.find(opt => opt.checked)['key']);

	const handleChange = async (key) => {
		setSelectedOption(key);
		await props.onChange(key);
		setTimeout(() => {
			setToggleMenu(false);
		}, 1000);
	}

	const dummyFunc = () => {

	}

	return (
		<div className="sort-options">
			<div className={`sort-menu ${toggleMenu ? "d-block" : "d-none"}`}>
				{
					props.options && props.options.map(option => (
						<div key={option.key} onClick={e => handleChange(option.key)}>
					    <input type="radio" name="sortOptn" id={option.key} value={option.val} checked={option.key === selectedOption} onChange={e => dummyFunc()}/>
					    <label htmlFor={option.val}>{option.val}</label>
				    </div>
					))
				}
			</div>
			<div className="sort-btn text-center" onClick={e => setToggleMenu(!toggleMenu)}>
				<i className="fa fa-sort-amount-asc"></i>
			</div>
		</div>
	)
};

export default SortComponent;