# NutriFHIR

## Description

NutriFHIR is a provider-facing application that helps doctors/dieticians incorporate nutritional data into the care process. 
The application is SMART on FHIR compliant, and was developed and tested in the Cerner Sandbox.

## How to Launch/Run Application

### Launching from Cerner Sandbox

* Clone/Fork NutriFHIR - git clone https://github.com/vksrinivasan/NutriFHIR.git
* Go to https://fhir.cerner.com/smart/
* Click Code Portal
* Register to Cerner Care if you have not already, and log in
* Click '+ New App'
* Fill out the fields as follows:
  * App Name: Whatever you'd like
  * SMART Launch URI: ANYHOSTADDRESSHERE/launchProvider 
    * Note -- If you want to run the application on local host replace ANYHOSTADDRESSHERE with http://127.0.0.1:6001/
  * Redirect URI: ANYHOSTADDRESSHERE/summary
    * Note -- Again, on local host, replace ANYHOSTADDRESSHERE with http://127.0.0.1:6001/
  * App Type: Provider
  * FHIR Spec: Dstu2
  * Authorized: Yes
  * Scopes - Standard Scopes: Leave defaults checked
  * Scopes - User Scopes/Patient Scopes: Check read access to all resources listed
* Register the application - Be sure to note down the ClientID listed once you register, as well as the Redirect URI you gave. Note, 
it takes 10-15 minutes for the application credentials to be registered in the Cerner Care System. So feel free to set a timer and wait.
* In the NutriFHIR repository that you have cloned, open ./views/launch.html
* Update lines 16 and 17 with your new client_id and redirect_uri
* Navigate back to base directory of repository
* npm install popper.js@^1.12.9
* npm install
* nodemon ./bin/www - Your local node server should now be running/hosting the application
* On the Cerner Developer portal, click your the name of the application you just created, then click Begin Testing
* Choose a patient and click next then launch. You may be required to provide credentials to Cerner's Millenium platform. Username is 
portal, password is portal. The application should now be visible and running in your browser.

-- Note, the repository comes with a Dockerfile. Feel free to use this file to create an image/skip the steps of installing popper.js 
and all the other modules.

## Important Files

* ./views/launch.html - Cerner/Epic/SMART on FHIR server accesses this page to initiate SMART on FHIR authentication. Any time you 
change permissions/scopes on your registered app via the Cerner Care website, you should make those changes in this file as well
* ./views/layouts/summary.handlebars - The page that gets redirected to once Oauth2 Authentication completes successfully. This is 
the main dashboard page of the NutriFHIR application
* ./public/javascripts/summarySOF.js - First script that gets called once SMART on FHIR authentication is completed. It pulls all 
required patient/encounter data that will be used and populates static display data across all modules.
* ./public/javascripts/vitalHandlers.js - These functions handle any clicks/mouseovers/plotting that need to occur with the vitals 
module 
* ./public/javascripts/staticDDP.js - These functions handle any clicks/mouseovers/plotting that need to occur with the diet 
indicators module
* ./public/javascripts/dietEnvironment.js - This script interfaces with the google maps api to present the diet environment module. 
All functions required for plotting favorite stores/list handling is done here
* ./public/javascripts/nutriSavingsController.js - Sample interface for hypothetical NutriSavings database
* ./NutriFHIR_Schema.sql - Creates database according to NutriSavings schema
