import React from "react";

const Form = props => (
	<form onSubmit={props.Search}>
		<input type="text" className="Textbox" name="searchTerm" placeholder="show me a..."/>
		<button className="Search-button">Dither!</button>
	</form>
);

export default Form;