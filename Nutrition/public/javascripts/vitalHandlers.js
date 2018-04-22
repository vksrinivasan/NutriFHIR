/* Globals to help determine whether I should allow new card creation */
var height_i = false;
var weight_i = false;
var bmi_i = false;
var glucose_i = false;     
var hba1c_i = false;     
var bp_i = false;
var tchol_i = false;
var hdl_i = false;
var ldl_i = false;

/* Generic create the card */
function createCard(id) {
	/* Create the card itself */ 
	
	/* Figure out where to put the next card 
	 * (It goes immediately after the parent)
	 */
	var parentEl = d3.select("#summary").node();
	var childEl = parentEl.childNodes;
	var parentIndex = 0;
	for(i = 0; i < childEl.length; i++) {
		if(childEl[i]['id']=='VitalCard') {
			parentIndex = i;
			break;
		}
	}
	var newCard = document.createElement('div');
	newCard.setAttribute('class', 'card');
	newCard.setAttribute('id', id);
	parentEl.insertBefore(newCard, parentEl.childNodes[parentIndex+1]);
	
	var drawdownCard = d3.select('#'+id);
						 
	/* Create the card container */
	var drawdownContainer = drawdownCard.append('div')
											.attr('id', 'container')
											.attr('class', 'movable');
											
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
}
 
/* Generic create card sides/divisions */
function createSide(cardBody, perc, side) {
	var side = cardBody.append('div')
			.attr('style', 'float:' + side + '; width: ' + perc)
			.style("overflow", "auto")
			.style("height", "75px"); //75px for 3 lines, can change to 100px for 4 lines
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

/* Generic plot data */
function createPlot(side, data, cardName) {
	var pData = data['graphData'];
	var cardData = document.getElementById(cardName.replace('#', ''));
	var cardDim = cardData.getBoundingClientRect();
	
	var width = cardDim.width;
	var height = math.max(cardDim.height, 200);
	
	// Get margin and new height/width
	margin = {top: 30, right: 50, bottom: 30, left: 50};
	width = width - margin.left - margin.right;
	height = height - margin.top - margin.bottom;
	
	// Set y axis scales
	var y_min_act;
	var y_max_act;
	var y_min_ref;
	var y_max_ref;
	var y_min;
	var y_max;
	
	try { 
		y_min_act = math.min(pData['values']);
	} 
	catch (err) {
		y_min_act = undefined;
	}
	
	try {
		var y_max_act = math.max(pData['values']);
	}
	catch (err) {
		y_max_act = undefined;
	}
	
	try {
		var y_min_ref = math.min(pData['refLo']);
	}
	catch (err) {
		y_min_ref = undefined;
	}
	
	try {
		var y_max_ref = math.max(pData['refHi']);
	} catch (err) {
		y_max_ref = undefined;
	}
	
	if(y_min_act != undefined && y_min_ref != undefined) {
		y_min = math.min(y_min_act, y_min_ref);
	} 
	else if (y_min_act != undefined) {
		y_min = y_min_act;
	} 
	else if (y_min_ref != undefined) {
		y_min = y_min_ref;
	} 
	else {
		y_min = 0;
	}
		
	if(y_max_act != undefined && y_max_ref != undefined) {
		y_max = math.max(y_max_act, y_max_ref);
	} 
	else if (y_max_act != undefined) {
		y_max = y_max_act;
	} 
	else if (y_max_ref != undefined) {
		y_max = y_max_ref;
	} 
	else {
		y_max = 0;
	}
	
	if(y_min === y_max) {
		var t_minmax = y_min;
		y_min = t_minmax - t_minmax;
		y_max = t_minmax + t_minmax;
	}
	
	y = d3.scale.linear()
				.domain([y_min, y_max])
				.range([height, 0]);
				
	// Set x axis scales
	var x_min = new Date(Math.min.apply(null, pData['dates']));
	var x_max = new Date(Math.max.apply(null, pData['dates']));
	
	x = d3.time.scale()
			   .domain([x_min, x_max])
			   .range([0, width]);
			   
	// Define axes
	var xAxis = d3.svg.axis().scale(x)
					  .orient("bottom")
					  .ticks(4);
					  
	var yAxis = d3.svg.axis().scale(y)
					  .orient("left")
					  .ticks(4);
					  
	// Define line plotting function
	var lineFunc = d3.svg.line()
						 .x(function(d) {
							 return x(d[0]);
						 })
						 .y(function(d) {
							 return y(d[1]);
						 })
						 .interpolate('linear');
						 
	// Add svg canvas
	var svg = d3.select(cardName)
				.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
				.append("g")
					.attr("transform",
								"translate(" + margin.left + "," + margin.top + ")");
								
	// Add x axis
	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + height + ")")
	.call(xAxis);
	
	// Add y axis
	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);
	
	// Plot Actual Data
 	var plotVals = [];
	var plotLo = [];
	var plotHi = [];
	for(i = 0; i < pData['dates'].length; i++) {
		if(pData['dates'][i] != 'undefined' && 
		   pData['values'][i] != 'undefined' && 
		   pData['refLo'][i] != 'undefined' && 
		   pData['refHi'][i] != 'undefined') {
		
			  plotVals.push([pData['dates'][i], pData['values'][i]]);
			  plotLo.push([pData['dates'][i], pData['refLo'][i]]);
			  plotHi.push([pData['dates'][i], pData['refHi'][i]]);
		   }
	}
	
	svg.append("path")
	   .attr('d', lineFunc(plotVals))
	   .attr('class', 'pathActual');
	   
	svg.append("path")
	   .attr('d', lineFunc(plotLo))
	   .attr('class', 'pathRef');
	   
	svg.append("path")
	   .attr('d', lineFunc(plotHi))
	   .attr('class', 'pathRef');
	   
	
	// Plot scatter plot circles
	
	svg.selectAll("circle")
	   .data(plotVals)
	   .enter()
	   .append("circle")
	   .attr("cx", function(d) {
		   return x(d[0]);
	   })
	   .attr("cy", function(d) {
		   return y(d[1]);
	   })
	   .attr("r", 3)
	   .attr('class', 'pointActual');
	   
}

function heightHandler() {
	var cardId = 'heightDrawdown';
	var cardTitle = 'Height';
	if(!height_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		height_i = !height_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, height_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, height_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("Height").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			height_i = !height_i;
		});
	} else {
		document.getElementById(cardId).remove();
		height_i = !height_i;
	}
}

function weightHandler() {
	var cardId = 'weightDrawdown';
	var cardTitle = 'Weight';
	if(!weight_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		weight_i = !weight_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, weight_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, weight_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("Weight").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			weight_i = !weight_i;
		});
	} else {
		document.getElementById(cardId).remove();
		weight_i = !weight_i;
	}
}

function bmiHandler() {
	var cardId = 'bmiDrawdown';
	var cardTitle = 'BMI';
	if(!bmi_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		bmi_i = !bmi_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, bmi_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, bmi_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("BMI").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			bmi_i = !bmi_i;
		});
	} else {
		document.getElementById(cardId).remove();
		bmi_i = !bmi_i;
	}
}

function glucoseHandler() {
	var cardId = 'glucoseDrawdown';
	var cardTitle = 'Glucose';
	if(!glucose_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		glucose_i = !glucose_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, glucose_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, glucose_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("Glucose").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			glucose_i = !glucose_i;
		});
	} else {
		document.getElementById(cardId).remove();
		glucose_i = !glucose_i;
	}
}

function hba1cHandler() {
	var cardId = 'hba1cDrawdown';
	var cardTitle = 'HbA1c';
	if(!hba1c_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		hba1c_i = !hba1c_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, hba1c_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, hba1c_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("HbA1c").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			hba1c_i = !hba1c_i;
		});
	} else {
		document.getElementById(cardId).remove();
		hba1c_i = !hba1c_i;
	}
}

function bpHandler() {
	var cardId = 'bpDrawdown';
	var cardTitle = 'Blood Pressure';
	if(!bp_i) {
			
		/* Create the card */
		cardBody = createCard(cardId);
		bp_i = !bp_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, bp_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, bp_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("Blood Pressure").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			bp_i = !bp_i;
		});
	} else {
		document.getElementById(cardId).remove();
		bp_i = !bp_i;
	}
}

function cholHandler() {
	var cardId = 'cholDrawdown';
	var cardTitle = 'Total Cholesterol';
	if(!tchol_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		tchol_i = !tchol_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, totChol_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, totChol_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("Total Cholesterol").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			tchol_i = !tchol_i;
		});
	} else {
		document.getElementById(cardId).remove();
		tchol_i = !tchol_i;
	}
}

function hdlHandler() {
	var cardId = 'hdlDrawdown';
	var cardTitle = 'HDL';
	if(!hdl_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		hdl_i = !hdl_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, hdl_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, hdl_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("HDL").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			hdl_i = !hdl_i;
		});
	} else {
		document.getElementById(cardId).remove();
		hdl_i = !hdl_i;
	}
}  
 
function ldlHandler() {
	var cardId = 'ldlDrawdown';
	var cardTitle = 'LDL';
	if(!ldl_i) {
		
		/* Create the card */
		cardBody = createCard(cardId);
		ldl_i = !ldl_i;
		
		/* Add title to the card */
		createTitleBurger(cardBody, cardTitle);
		
		/* Add sides */
		var lhs = createSide(cardBody, '100%', 'left');
		var rhs = createSide(cardBody, '0%', 'right');
		
		/* Add LHS Table */
		createTable(lhs, ldl_plot_data);
		
		/* Add RHS Plot */
		createPlot(rhs, ldl_plot_data, '#'+cardId);
		
		/* Potential DeepDive Card Listener */
		document.getElementById("LDL").addEventListener("click", function() {
			document.getElementById(cardId).remove();
			ldl_i = !ldl_i;
		});
	} else {
		document.getElementById(cardId).remove();
		ldl_i = !ldl_i;
	}
} 
