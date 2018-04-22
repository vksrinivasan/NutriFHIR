var data = {

	COMPANY : [{
			CompanyID : 1,
			Name : "Google"
		}, {
			CompanyID : 2,
			Name : "Facebook"
		}
	],

	EMPLOYEE : [{
			EmployeeID : 1,
			CompanyID : 1,
			FirstName : "Bob",
			LastName : "Smith",
			Division : "Product Management",
			OfficeID : 4
		}, {
			EmployeeID : 2,
			CompanyID : 1,
			FirstName : "Wilma",
			LastName : "Smart",
			Division : "Human Resource",
			OfficeID : 07779
		}, {
			EmployeeID : 1,
			CompanyID : 2,
			FirstName : "Fredrick",
			LastName : "Smart",
			Division : "Support",
			OfficeID : 334
		}, {
			EmployeeID : 2,
			CompanyID : 2,
			FirstName : "Irita",
			LastName : "Stook",
			Division : "Sales",
			OfficeID : 1259
		}
	],

	ACTIVITY : [{
			ActivityID : "NS001",
			Name : "Card added",
			Description : "Added a Rewards Card"
		}, {
			ActivityID : "NS002",
			Name : "Incentives earned",
			Description : "Trip Incentives earned (this will be based on incentives set up on NS at a company level on a monthly basis. Will return Yes or No)"
		}, {
			ActivityID : "NS012",
			Name : "Monthly score ",
			Description : "Monthly average score "
		}
	],

	EMPLOYEE_ACTIVITY : [{
			EmployeeID : 1,
			CompanyID : 2,
			ActivityID : "NS002",
			ActivityDate : "2016-05-19",
			ActivityValue : "true"
		}, {
			EmployeeID : 1,
			CompanyID : 1,
			ActivityID : "NS012",
			ActivityDate : "2017-08-09",
			ActivityValue : "43"
		}, {
			EmployeeID : 2,
			CompanyID : 2,
			ActivityID : "NS001",
			ActivityDate : "2018-03-12",
			ActivityValue : "1"
		}, {
			EmployeeID : 2,
			CompanyID : 1,
			ActivityID : "NS012",
			ActivityDate : "2018-04-10",
			ActivityValue : "17"
		},{
			EmployeeID : 1,
			CompanyID : 1,
			ActivityID : "NS001",
			ActivityDate : "2017-08-09",
			ActivityValue : "45"
		},{
			EmployeeID : 1,
			CompanyID : 2,
			ActivityID : "NS012",
			ActivityDate : "2016-07-29",
			ActivityValue : "25"
		},{
			EmployeeID : 2,
			CompanyID : 2,
			ActivityID : "NS012",
			ActivityDate : "2016-07-29",
			ActivityValue : "98"
		}, {
			EmployeeID : 1,
			CompanyID : 2,
			ActivityID : "NS001",
			ActivityDate : "2017-08-19",
			ActivityValue : "3"
		},{
			EmployeeID : 1,
			CompanyID : 1,
			ActivityID : "NS002",
			ActivityDate : "2017-08-09",
			ActivityValue : "false"
		}
	]

};

function nutrition_getEmployeeIDsByName(firstName, lastName){
	var e = data.EMPLOYEE.find(
		function (obj) { 
			return obj.FirstName === firstName && obj.LastName === lastName; 
		}
	);
	
	var eID;
	var cID;
	if(e){
		eID = e.EmployeeID;
		cID = e.CompanyID;
	}else{
		//not a valid employee in db so sending random eid and cid between 1-2
		eID = Math.floor(Math.random() * (3 - 1) + 1);
		cID = Math.floor(Math.random() * (3 - 1) + 1);
	}
	
	return [eID, cID];
}

function nutrition_getCompanyByID(cID){
	return data.COMPANY.find(
		function (obj) { 
			return obj.CompanyID === cID; 
		}
	)
}

function nutrition_getEmployeeByID(eID, cID){
	return data.EMPLOYEE.find(
		function (obj) { 
			return obj.EmployeeID === eID && obj.CompanyID === cID; 
		}
	)
}

function nutrition_getEmployeeActivitiesByID(eID, cID){
	return data.EMPLOYEE_ACTIVITY.filter(
		function (obj) { 
			return obj.EmployeeID === eID && obj.CompanyID === cID; 
		}
	)	
}

function nutrition_getActivityByID(aID){
	return data.ACTIVITY.find(
		function (obj) { 
			return obj.ActivityID === aID; 
		}
	)
}

function getPatientNutritionInfo(firstName, lastName){
	var IDs = nutrition_getEmployeeIDsByName(firstName, lastName);
	var eID = IDs[0];
	var cID = IDs[1];
	
	var company = nutrition_getCompanyByID(cID);
	var employee = nutrition_getEmployeeByID(eID, cID);
	var employee_activities = nutrition_getEmployeeActivitiesByID(eID, cID);
	
	var activities = [];
	employee_activities.forEach(
		function(obj){
			var activity = nutrition_getActivityByID(obj.ActivityID);
			var o = {};
			o.activityID = obj.ActivityID;
			o.activityName = activity.Name;
			o.activityDescription = activity.Description;
			o.activityDate = obj.ActivityDate;
			o.activityValue = obj.ActivityValue;
			activities.push(o);
		}
	);
	
	return {
		...employee,
		CompanyName: company.Name,
		activities: activities,
	}
}