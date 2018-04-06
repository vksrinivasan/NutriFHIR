/* Generic create the card */
function createCard(id) {
	/* Create card itself */
	var drawdownCard = d3.select('#summary')
						 .append('div')
							.attr('class', 'card')
							.attr('id', id);
						 
	/* Create the card container */
	var drawdownContainer = drawdownCard.append('div')
											.attr('id', 'container');
											
	/* Create the card body */
	var cardBody = drawdownContainer.append('div')
										.attr('id', 'drawDownInformation')
										.attr('class', 'card-body');
	
	return cardBody; 
}

/* Generic create title row with burger */
function createTitleBurger(cardBody, title) {
	var row = cardBody.append('div')
					  .attr('class', 'row');
						
	row.append('h2') 
	       .attr('class', 'card-title col-sm-11')
	       .attr('id', title)
		   .attr('style', 'cursor: pointer')
	       .text(title);

	row.append('div') 
	       .attr('class', 'glyphicon glyphicon-menu-hamburger pull-right card-hamburger')
	       .attr('aria-hidden', 'true');
}
 
/* Generic create card sides/divisions */
function createSide(cardBody, perc, side) {
	var side = cardBody.append('div')
							.attr('style', 'float:' + side + '; width: ' + perc);
	return side;
}

/* Generic create table */
function createTable(side, data) {
	var tableBody = side.append('table')
							.attr('class', 'deepDiveTable')
						.append('tbody');
	
	createTableHeader(tableBody, data['tableData']['headers']);
	populateTable(tableBody, data['tableData']);
}

/* Generic create table header */
function createTableHeader(tableBody, headers) {
	var tableRow = tableBody.append('tr');
	for(i = 0; i < headers.length; i++) {
		tableRow.append('th')
					.attr('class', 'deepDiveTableLabel')
					.text(headers[i]);
	}
}

/* Generic populate table */
function populateTable(tableBody, data) {
	for(i = 0; i < data['Date'].length; i++) {
		var tempTableRow = tableBody.append('tr');
		
		for(j = 0; j < data['headers'].length; j++) {
			if(data['headers'][j] === 'Value') {
				tempTableRow.append('th')
							.attr('class', 'deepDiveTableLabel')
							.attr('nowrap', 'nowrap')
							.style('color', data['colors'][i])
							.text(data[data['headers'][j]][i]);
			} else {
				tempTableRow.append('th')
								.attr('class', 'deepDiveTableLabel')
								.attr('nowrap', 'nowrap')
								.style('color', '#000000')
								.text(data[data['headers'][j]][i]);
			}
		}
	}
}

function heightHandler() {
	
	/* Create the card */
	cardBody = createCard('heightDrawdown');
	
	/* Add title to the card */
	createTitleBurger(cardBody, "Height Deepdive");
	
	/* Add sides */
	var lhs = createSide(cardBody, '50%', 'left');
	var rhs = createSide(cardBody, '50%', 'right');
	
	/* Add LHS Table */
	createTable(lhs, height_plot_data);
	
	/* Potential DeepDive Card Listener */
	document.getElementById("Height Deepdive").addEventListener("click", function() {
		document.getElementById("heightDrawdown").remove();
	});
}

 