import React from "react";

const Form = props => (
	<form onSubmit={props.Search}>
		<div className="search-form">
		<input type="text" className="Textbox" name="searchTerm" placeholder="show me a..."/>
		<button name="bw" className="bw-button">Dither in b &amp; w</button>
		<button name="color" className="color-button">Dither in color</button>
		</div>
	</form>
);

export default Form;