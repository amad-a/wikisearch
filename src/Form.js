import React from "react";

const Form = props => (
	<form onSubmit={props.Search}>
		<div className="search-form">
		<input className="Search-input" type="text" className="Textbox" name="searchTerm" placeholder="show me a..."/>
		<button className="Search-button">Dither!</button>
		</div>
	</form>
);

export default Form;