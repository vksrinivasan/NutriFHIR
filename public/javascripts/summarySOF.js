//Global variable
var meds=[]
var pat_addr;
var height_plot_data;
var weight_plot_data;
var bmi_plot_data;
var glucose_plot_data;
var hba1c_plot_data;
var bp_plot_data;
var totChol_plot_data;
var hdl_plot_data;
var ldl_plot_data;
var encounterId_Locations = {};

/* Required Smart on Fhir On Ready Function */
function onReady(smart) {
  var patient = smart.patient;
  var pt = patient.read();
  var obv = smart.patient.api.fetchAll({

    // Note - I don't know how to sort results by time or anything. Someone
    // should figure that out
    type: 'Observation',
    query: {
      code: {
        $or: ['http://loinc.org|3141-9', // Body weight measured
              'http://loinc.org|8302-2', // Body height
              'http://loinc.org|39156-5', // BMI
              'http://loinc.org|14647-2',//Cholesterol in serum(moles/volume)
              'http://loinc.org|2093-3',//Cholesterol in serum(mass/volume)
              'http://loinc.org|4548-4',//Hba1c
              'http://loinc.org|2085-9',//HDL
              'http://loinc.org|13457-7',//LDL
			  'http://loinc.org|2345-7', // Glucose in Serum/Plasma
			  'http://loinc.org|8480-6', // Systolic Blood Pressure
			  'http://loinc.org|8462-4', // Diastolic Blood Pressure
            ]
      }
    }

  });
  var isDiabetic = 0;
  var hasHypertension = false;

  //var cond = smart.patient.api.search({type: 'Condition'});
  //var meds = smart.patient.api.search({type: 'MedicationOrder'});
  //var allMeds = smart.patient.api.search({type: 'MedicationStatement'})

  //var allergies = smart.patient.api.search({type: 'AllergyIntolerance'});



  // /* Generate Medication List */
  smart.patient.api.fetchAllWithReferences({type: "MedicationStatement"}).then(function(results) {
    id = 0;

   //Trying timeline concept
   results.forEach(function(statement){
     //console.log(statement)
     item = {}

     //try{
     item.id =  id
     if(statement.effectivePeriod !== undefined){
     item.start =  new Date(statement.effectivePeriod.start)
     if(statement.effectivePeriod.end !== undefined){
          item.end = new Date(statement.effectivePeriod.end)
          diff = Math.abs(item.start.getTime() - item.end.getTime()) / 3600000;
          if(diff > 48){
          item.type = 'range'
          }
          else{
            item.type = 'point'
          }
        }
        }
     else if(statement.effectiveDateTime !== undefined){
      item.start = new Date(statement.effectiveDateTime)
      }

      if(item.start == 'Invalid Date'){
        //console.log(statement.dateAsserted)
        item.start = new Date(statement.dateAsserted)
      }


      //console.log(item.start)
      if(!item.type){
        item.type = 'point'
      }

      if(statement.medicationCodeableConcept !== undefined){

      if(statement.medicationCodeableConcept.coding !== undefined){
        item.content = statement.medicationCodeableConcept.coding[0].display
      }
      else if(statement.medicationCodeableConcept.text !== undefined){
        item.content = statement.medicationCodeableConcept.text
      }
      else if(statement.medicationReference !== undefined){
        item.content = statement.medicationReference.reference
      }
    }

     if(statement.dosage !== undefined){
       if(statement.dosage[0].route !== undefined ){
       if(statement.dosage[0].route.text !== undefined){
         item.route = statement.dosage[0].route.text
            }
      }
    }

    if(statement.dosage !== undefined){
        if(statement.dosage[0].quantityQuantity !== undefined){
     item.dosageQuantity = statement.dosage[0].quantityQuantity.value +" "+statement.dosage[0].quantityQuantity.unit
   }
    }

    item.status = statement.status
    if(item.status == 'active'){
      item.sflag = 'active'
      item.className = 'active prac'
    }
    else{
      item.sflag = 'inactive'
      item.className = 'inactive pat'
    }
    if(statement.informationSource !== undefined){
      item.source = statement.informationSource.display
      if(statement.informationSource.reference !== undefined){
        if(statement.informationSource.reference.split("/")[0] = "Practitioner")
        {
          item.reference = statement.informationSource.reference
          item.flag = 'prac'
        }
        else{
          item.reference = 'Patient'
          item.flag ='pat'
        }
      }
    }

    else{
      item.reference = 'Patient'
      item.flag = 'pat'
    }


    //format tooltip dispalay
    item.title = '<p class = "tooltip-header tiptitle">'+item.content+'<p><br>'+
                 '<b class = "tipcontent">Source : '+item.source+'</b><br>'+
                 '<b class = "tipcontent">Status : '+item.status+'</b><br>'+
                 '<b class = "tipcontent">Route : '+item.route+'</b><br>'+
                 '<b class = "tipcontent">Dose : '+item.dosageQuantity+'</b><br>'
    //}

  //  catch (e){
  //    console.log(e)
  //  }

    //console.log(item)


    if(item.status !== 'entered-in-error'){

      if(item.content !== undefined){
          meds.push(item)
          //console.log(item.content)
          }
      }

    id =id +1;

     });

    //console.log(meds)
     //Build timeline
     var cap_options = {
         tooltip: {
         followMouse: false,
         overflowMethod: 'cap'
       },
       maxHeight : '400px',
       minHeight : '400px',
       showTooltips : false
     }


     var container = document.getElementById('tooltips')
     var items = new vis.DataSet(meds)


     var toolT = new vis.Timeline(container,items, cap_options);
     //var Timeline = new vis.Timeline(container,items,options)



     //Event handler for radio buttons
     $(function(){
       $("[name=filter]").change(function(){


         if($('#statusCheck').prop('checked')){

            if($(this).attr("id") == 'prac'){
            //console.log($('#statusCheck').prop('checked'))
            items.forEach(function(each){
                  if(each.flag == 'pat'){
                    items.update({id : each.id, className : "hide"+" "+each.status})
                    //console.log('hide pat')
                    }
                  if(each.flag == 'prac' && each.sflag == "inactive") {
                    items.update({id : each.id, className : "hide"+" "+each.status})
                    //console.log('hide prac and inactive')
                  }
                  if(each.flag == 'prac' && each.sflag == "active"){
                    items.update({id : each.id, className : "visible"+" "+each.status})
                    //console.log(each)
                    //console.log('show prac and active')
                  }
                 })

               }

           if($(this).attr("id") == 'pat'){
            items.forEach(function(each){
                  if(each.flag == 'prac'){
                    items.update({id : each.id, className : "hide" +" "+ each.status})
                    //console.log('hide prac')
                    }
                  if(each.flag == 'pat' && each.sflag == "inactive") {
                    items.update({id : each.id, className : "hide"+" "+each.status})
                    //console.log('hide pat and inactive')
                  }
                  if(each.flag == 'pat' && each.sflag == "active"){
                    items.update({id : each.id, className : "visible"+" "+each.status})
                    //console.log(each)
                    //console.log('show pat and active')
                  }
                 })
          }

          if($(this).attr("id") == 'all'){
            items.forEach(function(each){
              if(each.sflag == "inactive"){
              //console.log("hide inactive "+each.status,each.flag)
              items.update({id : each.id, className : "hide" +" "+ each.status})
              }
              else{
                items.update({id : each.id, className : "visible" +" "+ each.status})
              }
            })
          }

          }

          if(!$('#statusCheck').prop('checked')){

             if($(this).attr("id") == 'prac'){
             //console.log($('#statusCheck').prop('checked'))
             items.forEach(function(each){
                   if(each.flag == 'pat'){
                     items.update({id : each.id, className : "hide"+" "+each.status})
                     //console.log('hide pat')
                     }
                   if(each.flag == 'prac') {
                     items.update({id : each.id, className : "visible"+" "+each.status})
                     //console.log('show')
                   }
                  })

                }

            if($(this).attr("id") == 'pat'){
             items.forEach(function(each){
                   if(each.flag == 'prac'){
                     items.update({id : each.id, className : "hide" +" "+ each.status})
                     //console.log('hide prac')
                     }
                   if(each.flag == 'pat') {
                     items.update({id : each.id, className : "visible"+" "+each.status})
                     //console.log('show pat')
                   }
                  })
                }

           if($(this).attr("id") == 'all'){
             items.forEach(function(each){
               //console.log("hide inactive "+each.status,each.flag)
               items.update({id : each.id, className : "visible" +" "+ each.status})
             })
           }

           }




          });

     })

     //Event handling for checkbox
     $('#statusCheck').change(function(){
       var selectedRadio = $('input[type=radio][name=filter]:checked').attr('id')
       if(this.checked){
         if(selectedRadio == 'pat'){
           items.forEach(function(each){
             if(each.sflag == "inactive" && each.flag == "pat"){
             items.update({id : each.id, className : "hide" +" "+ each.status})
           }
           })
         }
         if(selectedRadio == 'prac'){
           items.forEach(function(each){
             if(each.sflag == "inactive" && each.flag == "prac"){
             items.update({id : each.id, className : "hide" +" "+ each.status})
           }
           })
         }
         else{
           items.forEach(function(each){
             if(each.sflag == "inactive"){
             items.update({id : each.id, className : "hide" +" "+ each.status})
              }
           })
         }
       }
       else{
         if(selectedRadio == 'pat'){
           items.forEach(function(each){
             if(each.sflag == "inactive" && each.flag == "pat"){
             items.update({id : each.id, className : "visible" +" "+ each.status})
           }
           })
         }
         else if(selectedRadio == 'prac'){
           items.forEach(function(each){
             if(each.sflag == "inactive" && each.flag == "prac"){
             items.update({id : each.id, className : "visible" +" "+ each.status})
           }
           })
         }
         else{
           items.forEach(function(each){
             if(each.sflag == "inactive"){
             items.update({id : each.id, className : "visible" +" "+ each.status})
              }
           })
         }
       }
      });

      //tooltips

      $(document).on("mouseover",".vis-item", function (){
        var test = $(this).text()
        items.forEach(function(each){
          if(each.content == test){
          //console.log(each)
          $("#medTitle").text(each.content)
          $("#source").text("Source : "+each.reference)
          $("#dose").text("Dose : "+each.dosageQuantity)
          $("#status").text("Status : "+each.sflag)
        }
        })
        //console.log($(this).next('div').text())
        //console.log($('.custom-tip').children())
        var content = $('.custom-tip').children()[1].innerHTML+"<br>"+$('.custom-tip').children()[3].innerHTML
        +"<br>"+$('.custom-tip').children()[5].innerHTML
        var title = $('.custom-tip').children()[0].innerHTML

        $(this).qtip({
            content: {
              title: title,
              text: content
            },
            show: 'click',
            style: {
              classes: 'myCustomClass'
            },
            position: {
                target: 'mouse'
              }
        });
      })


   });







  /* Go through encounters */
  //console.log('on encounters');
  smart.patient.api.fetchAllWithReferences({type: "Encounter"}).then(function(results) {
    results.forEach(function(statement){
      if(statement['location'] == undefined) {
        encounterId_Locations[statement.id] = 'N/A';  
      } else { 
        encounterId_Locations[statement.id] = statement['location'][0]['location']['display'];
      }
    });
  });

  //console.log(encounterId_Locations);



  /* Generate Problem List */
  /*
   smart.patient.api.fetchAllWithReferences({type: 'Condition'}).then(function(results) {
   results.forEach(function(condition){
	if (condition.code.text !== "Entered In Error" && condition.category.text == "Problem") {
          //$("#problems-list").append("<p>" + condition.code.text + "</p>");
	}
	if (condition.code.text.toLowerCase().indexOf("diabetes") >= 0) {
	  //console.log("Has diabetes");
	  isDiabetic += 1;
	}
     });
   });
*/

  /* Generate Allergy List */
  /*
  smart.patient.api.fetchAllWithReferences({type: 'AllergyIntolerance'}).then(function(results) {
   results.forEach(function(allergy){
	if (allergy.substance.coding) {
          $("#allergies-list").append("<p>" + allergy.substance.text + "</p>");
	}
     });
   });*/
 
  $.when(pt, obv, meds).fail(onError);
  $.when(pt, obv, meds).done(
    function(patient, obv, prescriptions) {
      console.log(patient);
      // console.log(obv);
      // console.log(conditions);
      // console.log(prescriptions);
      // console.log(allergies);

      /* Get Name */
      var fname = '';
      var lname = '';
      if(typeof patient.name[0] !== 'undefined') {
        fname = patient.name[0].given.join(' ').toLowerCase();
        lname = patient.name[0].family.join(' ').toLowerCase();
      }

      $("#Patient_Name").text(
        titleCase(fname) + ' ' + titleCase(lname)
      );

      /* Get Patient Gender */
	  var pGender = 'N/A';
	  if(typeof patient['gender'] !== 'undefined') {
		  pGender = patient['gender'];
		  $("#gender_text").text(
			titleCase(pGender)
		  );
	  } else {
		  $("#gender_text"  ).text(pGender);
	  }


      /* Hispanic or Latino? */

      //$("#hisp_or_lat_text").text(patient['extension'][1]['extension'][1].valueString);


      /* Get Patient Marital Status */
	  var pMStatus = 'N/A';
	  if(typeof patient['maritalStatus'] !== 'undefined') {
		  pMStatus = patient['maritalStatus'];
		  $("#married_text").text(
			titleCase(pMStatus.text)
		  );
	  } else {
		  $("#married_text").text(
			pMStatus
		  );
	  }



      /* Get Patient Birth Date and Age*/
      var dob = new Date(patient['birthDate']);
      var day = dob.getDate();
      var monthIndex = dob.getMonth() + 1;
      var year = dob.getFullYear();

      var today = new Date();
      var age = today.getFullYear() - year;
      if (today.getMonth() < monthIndex || (today.getMonth() == monthIndex && today.getDate() < day)) {
          age--;
      }

      if (day < 10) {
        day = '0' + day;
      }
      if (monthIndex < 10) {
        monthIndex = '0' + monthIndex;
      }

      var dobStr = monthIndex + "/" + day + '/' + year;
      //console.log(dobStr);

	  $('#dob_text').text(dobStr);
	  $('#age_text').text(age);
      //$("#dob_age_text").text(dobStr + " (" + age + "Y)");


      /* Get Patient Address */
      if (patient['address']) {
	      var adr = patient['address'][0]['line'][0];
	      var city = patient['address'][0].city;
	      var state = patient['address'][0].state;
	      var fullAddress = adr + ", " + city + ", " + state;
	      $("#addr_text").text(
		(fullAddress)
	      );
      }
      else {
	      /* no patient address - empty string */
	      var fullAddress = "NA";
      }

/*       function normalize(phone) {
        //normalize string and remove all unnecessary characters
        phone = phone.replace(/[^\d]/g, "");
        //check if number length equals to 10
        if (phone.length == 10) {
            //reformat and return phone number
            return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1)-$2-$3");
        }
        return null;
      }
      var phoneNum = patient['telecom'][0]['value'];
      phoneNum = normalize(phoneNum);

      $("#home_phone_text").text(
        (phoneNum)
      ); */

      /* Print statuses for diabetes and hypertension */
      /* console.log("Diabetes: " + isDiabetic);
      if (isDiabetic > 0) {
	       $("#has-diabetes").text("Yes");
      }
      else {
	       $("#has-diabetes").text("No");
      }

      if (hasHypertension) {
	       $("#has-hypertension").text("Yes");
      }
      else {
	       $("#has-hypertension").text("No");
      }*/

      /* Get Weight */
      var byCodes = smart.byCodes(obv, 'code');
      var weight = byCodes('3141-9');
	  weight = sortObv(weight);
	  var weightFinal = getQuantityValueAndUnit(weight[0]);
	  if(weightFinal == '-') {
			$("#weight-text").text('N/A');
	  } else {
		  $("#weight-text").text(weightFinal);
	  }


      /* Get Height */
      var height = byCodes('8302-2');
	  height = sortObv(height);
	  var heightFinal = getQuantityValueAndUnit(height[0]);
	  if(heightFinal == '-') {
		  $("#height-text").text('N/A');
	  } else {
		  $("#height-text").text(heightFinal);
	  }


      /* Get BMI */
      var BMI = byCodes('39156-5');
	//console.log(BMI);
	  BMI = sortObv(BMI);
	  var BMIFinal = getQuantityValueAndUnit(BMI[0]);
	  if(BMIFinal == '-') {
		  $("#bmi-score").text('N/A');
	  } else {
		  $("#bmi-score").text(BMIFinal);
		  colorField("#bmi-score", BMI[0]);
	  }


      /*Get Cholesterol(moles/volume) in Serum*/
      var cholesterol = byCodes('14647-2')
      cholesterol = sortObv(cholesterol);

      /*Get total HBA1C*/
      var hba1c = byCodes('4548-4')
      hba1c = sortObv(hba1c);
	  var hba1cFinal = getQuantityValueAndUnit(hba1c[0]);
	  if(hba1cFinal == '-') {
		  $("#hba1c-score").text('N/A');
	  } else {
		  $("#hba1c-score").text(hba1cFinal);
		  colorField("#hba1c-score", hba1c[0]);
	  }


      /*Get total cholesterol*/
      var chol = byCodes('2093-3')
      chol = sortObv(chol);
	  var cholFinal = getQuantityValueAndUnit(chol[0]);
	  if(cholFinal == '-') {
		  $("#chol").text('N/A');
	  } else {
		  $("#chol").text(cholFinal);
		  colorField("#chol", chol[0]);
	  }

      /*Get HDL*/
      var hdl = byCodes('2085-9')
      hdl = sortObv(hdl);
	  var hdlFinal = getQuantityValueAndUnit(hdl[0]);
	  if(hdlFinal == '-') {
		  $("#hdl-score").text('N/A');
	  } else {
		  $("#hdl-score").text(hdlFinal);
		  colorField("#hdl-score", hdl[0]);
	  }

      /*Get LDL*/
      var ldl = byCodes('13457-7');
      ldl = sortObv(ldl);
	  var ldlFinal = getQuantityValueAndUnit(ldl[0]);
	  if(ldlFinal != '-') {
		  $("#ldl-score").text(ldlFinal);
		  colorField("#ldl-score", ldl[0]);
	  } else {
		  $("#ldl-score").text('N/A');
	  }


      /*Get Glucose [Mass/volume] in serum or plasma*/
      var gluc = byCodes('2345-7');
      gluc = sortObv(gluc);
	  var glucFinal = getQuantityValueAndUnit(gluc[0]);
	  if(glucFinal == '-') {
		  $("#gluc-score").text('N/A');
	  } else {
		  $("#gluc-score").text(glucFinal);
		  colorField("#gluc-score", gluc[0]);
	  }


      /*Get Systolic Blood Pressure*/
      var sbp = byCodes('8480-6');
      sbp = sortObv(sbp);
	  var sbpFinal = getQuantityValueAndUnit(sbp[0]);
	  if(sbpFinal == '-') {
	     $("#sbp-text").text('N/A');
	  } else {
		 $("#sbp-text").text(sbpFinal);
		 colorField("#sbp-text", sbp[0]);
	  }

      /*Get Diastolic Blood Pressure*/
      var dbp = byCodes('8462-4')
      dbp = sortObv(dbp);
	  var dbpFinal = getQuantityValueAndUnit(dbp[0]);
	  if(dbpFinal == '-') {
	      $("#dbp-text").text('N/A');
	  } else {
		  $("#dbp-text").text(dbpFinal);
		  colorField("#dbp-text", dbp[0]);
	  }

	  var address = fullAddress;
      var queryType = "Groceries";
      pat_addr = fullAddress;

	  /* Fill out all plot data global variables we will use */
	  height_plot_data = populatePlotData(height, false);
	  weight_plot_data = populatePlotData(weight, false);
	  bmi_plot_data = populatePlotData(BMI, true);
	  glucose_plot_data = populatePlotData(gluc, true);
	  hba1c_plot_data = populatePlotData(hba1c, true);
	  bp_plot_data = populatePlotData({}, true);
	  totChol_plot_data = populatePlotData(chol, true);
	  hdl_plot_data = populatePlotData(hdl, true);
	  ldl_plot_data = populatePlotData(ldl, true);

    }
  )
}

/* Sort obv */
function sortObv(obv) {
      if(obv.length == 0) {
            return obv;
      } else {
            obv.sort(function(a,b) {
		return new Date(Date.parse(b.issued)) - new Date(Date.parse(a.issued));
	    });
	    return obv;
      }
      
}

/* Required On Error function */
function onError() {
  console.log('Loading error', arguments);
}

/* Helper function to populate the structs we need for the deepdive cards */
function populatePlotData(data, needColor) {
	td = {Value: [], Date: [], Method: [], Location: [], headers: [], colors: []};
	gd = {values: [], refHi: [], refLo: [], dates: [], units: []};

	var checkSeen = {};

	for(i = 0; i < data.length; i++) {

		tDate = getDate(data[i]);
		if(tDate.substring(0,10) in checkSeen) {
			continue;
		}

		checkSeen[tDate.substring(0,10)] = true;

		/* Push Table Data */
		td['Value'].push(getQuantityValueAndUnit(data[i]));
		td['Date'].push(tDate.substring(0,10));

		if(needColor) {
			td['colors'].push(getColor(data[i])[1]);
		}
		else {
			td['colors'].push('none');
		}

		// Use our encounter dictionary to find out where the encounter occured
		var encounter_num = parseInt(data[i]['encounter']['reference'].replace('Encounter/', ''));
		td['Location'].push(encounterId_Locations[encounter_num]);

		// Try to get method
		td['Method'].push(getMethod(data[i]));

		/* Push Graph Data */
		gd['values'].push(getValue(data[i]));
		gd['refHi'].push(getRefHi(data[i]));
		gd['refLo'].push(getRefLo(data[i]));
		gd['dates'].push(new Date(tDate));
		gd['units'].push(getUnits(data[i]));
	}

	gd['refHi'] = cleanReferenceLoHi(gd['refHi']);
	gd['refLo'] = cleanReferenceLoHi(gd['refLo']);

	td['headers'] = ['Value', 'Date', 'Method', 'Location'];
	console.log(td);
	return {tableData: td, graphData: gd};
}

/* Helper function to clean reference hi/lo data */
function cleanReferenceLoHi(data) {
	var retArray = new Array(data.length);

	var avgVal = undefined;
	for(i = 0; i < data.length; i++) {
		if(data[i] != undefined) {
			avgVal = data[i];
		}
	}

	for(i = 0; i < retArray.length; i++) {
		retArray[i] = avgVal;
	}
	return retArray;
}

/* Helper Function To Convert Lower-case words to Upper Case First letter */
function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for(var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

/* Helper Function to Check If Leap Year - Needed To Get Age */
function isLeapYear(year) {
    return new Date(year, 1, 29).getMonth() === 1;
}

/* Helper Function to Calculate Age */
function calculateAge(date) {
  if (Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime())) {
    var d = new Date(date), now = new Date();
    var years = now.getFullYear() - d.getFullYear();
    d.setFullYear(d.getFullYear() + years);
    if (d > now) {
      years--;
      d.setFullYear(d.getFullYear() - 1);
    }
    var days = (now.getTime() - d.getTime()) / (3600 * 24 * 1000);
    return years + days / (isLeapYear(now.getFullYear()) ? 366 : 365);
  }
  else {
    return undefined;
  }
}

/* Helper Function to Get Method of Observation */
function getMethod(ob) {
	if (typeof ob != 'undefined' &&
		typeof ob.method != 'undefined') {
			return ob.method;
	} else {
		return '-'
	}
}

/* Helper Function to Get Quantity Value/Units for a Given Observation */
function getQuantityValueAndUnit(ob) {
  if (typeof ob != 'undefined' &&
      typeof ob.valueQuantity != 'undefined' &&
      typeof ob.valueQuantity.value != 'undefined' &&
      typeof ob.valueQuantity.unit != 'undefined') {
	if (ob.valueQuantity.value > 300) {
		console.log('> 300');
		console.log(ob);
	}
        return parseFloat(ob.valueQuantity.value.toFixed(2)) + ' ' + ob.valueQuantity.unit;
  } else {
    return '-';
  }
}

/* Helper function to get value */
function getValue(ob) {
	if(typeof ob != 'undefined' &&
	   typeof ob.valueQuantity != 'undefined' &&
	   typeof ob.valueQuantity.value != 'undefined') {
		   return ob.valueQuantity.value;
   } else {
	   return undefined;
   }
}

/* Helper function to get dates */
function getDate(ob) {
	if(typeof ob != 'undefined' &&
	   typeof ob.effectiveDateTime != 'undefined') {
			return ob.effectiveDateTime;
    } else {
		return undefined;
	}
}

/* Helper function to get refHi */
function getRefHi(ob) {
	if(typeof ob != 'undefined' &&
	   typeof ob.referenceRange != 'undefined' &&
	   typeof ob.referenceRange[0] != 'undefined' &&
	   typeof ob.referenceRange[0].high != 'undefined' &&
	   typeof ob.referenceRange[0].high.value != 'undefined') {
		   return ob.referenceRange[0].high.value;
   } else {
	   return undefined;
   }
}

/* Helper function to get reflo */
function getRefLo(ob) {
	if(typeof ob != 'undefined' &&
	   typeof ob.referenceRange != 'undefined' &&
	   typeof ob.referenceRange[0] != 'undefined' &&
	   typeof ob.referenceRange[0].low != 'undefined' &&
	   typeof ob.referenceRange[0].low.value != 'undefined') {
		   return ob.referenceRange[0].low.value;
   } else {
	   return undefined;
   }
}

/* Helper function to get units */
function getUnits(ob) {
	if(typeof ob != 'undefined' &&
	   typeof ob.valueQuantity != 'undefined' &&
	   typeof ob.valueQuantity.code != 'undefined') {
		   return ob.valueQuantity.code;
   } else {
	   return undefined;
   }
}

function getColor(ob) {
  if (typeof ob != 'undefined' &&
      typeof ob.valueQuantity != 'undefined' &&
      typeof ob.valueQuantity.value != 'undefined' &&
      typeof ob.referenceRange != 'undefined' &&
      typeof ob['referenceRange'][0]['high'] != 'undefined' &&
      typeof ob['referenceRange'][0]['high']['value'] != 'undefined' &&
      typeof ob['referenceRange'][0]['low'] != 'undefined' &&
      typeof ob['referenceRange'][0]['low']['value'] != 'undefined')

  {
        var color = d3.scale.linear().domain([ob['referenceRange'][0]['low']['value'], ob['referenceRange'][0]['high']['value']])
			.interpolate(d3.interpolateHcl)
			.range([d3.rgb('#4CBB17'), d3.rgb("#C21807")]);

		if (ob.valueQuantity.value > ob['referenceRange'][0]['high']['value']) {
		  var value_color = "#C21807";
		}
		else if (ob.valueQuantity.value < ob['referenceRange'][0]['low']['value']) {
		  var value_color = "#C21807";
		}
		else {
		  var value_color = 'none';//color(ob.valueQuantity.value);
		}
		return [true, value_color];
  }
  else {
	return [false, "#000000"]
  }
}

/* Helper Function to color Observation value appropriately (assumes lower is better, green is good and red is bad)*/
function colorField(fieldID, ob) {
	var value_color = getColor(ob);
	if(value_color[0]) {
		d3.select(fieldID).style("color", value_color[1]);
	} else {
		//console.log("not coloring " + fieldID);
		if (typeof ob != 'undefined') {
		//console.log(typeof ob.referenceRange[0]['high']);
		}
	}
}

/* Helper Functions to Generate Medication List From Search Results for MedicationOrders */
function getMedicationName (medCodings) {
  var coding = medCodings.find(function(c){
    return c.system == "http://www.nlm.nih.gov/research/umls/rxnorm";
  });

  return coding && coding.display || "Unnamed Medication(TM)"
}

function displayMedication (medCodings) {
  $("#med-list").append("<p>" + getMedicationName(medCodings) + "</p>");
}

/*Define toggler function for the dropdown*/
function toggler(divId) {
    $("#" + divId).toggle();
}

/*Draw Spider Chart for a given set of scores in the target div*/
function drawSpider(target,scores){

  Highcharts.chart(target, {

    chart: {
        polar: true,
        type: 'line'
    },

    title: {
        text: 'Nutrition Score Comoponents',
        x: -80
    },

    xAxis: {
        categories: ['Fruits', 'Vegetables', 'Grains', 'Dairy',
                'Protein Foods', 'Fats', 'Refined Grains', 'Sodium', 'Empty Calories'],
        tickmarkPlacement: 'on',
        lineWidth: 0
    },

    yAxis: {
        gridLineInterpolation: 'polygon',
        lineWidth: 0,
        min: 0,
        max: 20
    },

    tooltip: {
        shared: true,
    },

    legend: {
        align: 'center',
        verticalAlign: 'top',
        layout: 'horizontal'
    },
    series : scores
})};

/*Fake data for spider chart*/
test= [
  {
    name: 'Purchase period 1',
    data: [1,5, 10, 3, 1, 4, 6,8,19],
    pointPlacement: 'on'
},
{
    name: 'Purchase period 2',
    data: [1,6, 3, 10, 5, 8, 3,2,12],
    pointPlacement: 'on'
},
{
    name: 'Purchase period 3',
    data: [9,9, 8, 10, 6, 9, 7,8,7],
    pointPlacement: 'on'
},
{
    name: 'Reference',
    data: [10,10, 10, 10, 10, 10, 10,10,20],
    //pointPlacement: 'on'
}
];

/*Draw charts that are independant of FHIR calls*/
window.onload=function() {
  //document.getElementById("nutrient-score").innerHTML = 42;//Cuz, answer to everything
  //drawSpider("progress-chart",test)
}

/*Draw line graph*/
function drawGraph(target,title,measurement,rangehigh,rangelow,xtitle,ytitle,min,max){

  series = [{name : xtitle,data:[]}]
  measurement.forEach(function(measurement){
    date = new Date(measurement.meta.lastUpdated)
    formattedDate = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())
    series[0].data.push([formattedDate,measurement.valueQuantity.value])
  })
  //console.log(series)

  Highcharts.chart(target,{

    title : {text : title, x: -80},
    xAxis: {
        type: 'datetime',
        tickInterval : 6 * 30 * 24 * 365
    },
      yAxis :{
      min : min,
      max : max,
      plotBands : [{
          from: rangelow, // Start of the plot band
          to: rangehigh, // End of the plot band
          color: 'rgba(68, 170, 213, 0.1)', // Color value
          label : {text : 'Reference region', style : { color : '#606060'}}
        }],
      title:{ text : ytitle}

        },
    series : series

    })
}
