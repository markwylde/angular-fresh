# angular-fresh
A fresh boilerplate to create a modular AngularJS project. Use angular-fresh for your project and you will get an out of the box modular and integratable pattern using Angular and Bootstrap that's ready to hook into your REST/API based server.

![alt text][logo]

[logo]: http://s29.postimg.org/r9h9ximwn/Angular_Fresh_1_0_1_Screenshot.png "AngularFresh Screenshot"


## How to install
##### 1) Checkout into a web folder
    git clone https://github.com/markwylde/angular-fresh.git

##### 2) Navigate to the dist folder
	http://localhost/angular-fresh/dist/

## Making changes
When developing your project you should run gulp in the background. Gulp has three main tasks:

 1. **gulp watch**
	Watches for changes in the **src** folder then builds
 2. **gulp build**
	Builds the JavaScript, TypeScript and CSS files
 3. **gulp compile**
   Copys the assets and vendor files over to dist

## Activating modules
When building your project try and split it up into separate reusable apps and put them in the **./modules** folder.

To include a module in your project edit the **./app.js** file to include the app.

	angular.module('app', [
	    'app.api',
	    'app.core',
	    ...
	])

## File Structure
Since file structure is largely opinion based you can move the files around in a module to any location you like. For example two patterns are below:

### Separated components
	./modules/Test/controllers
		page.controllers.js
	./modules/Test/directives
		rating.directive.js
		vote.directive.js
		listen.directive.js
	./modules/Test/services
		vote.service.js
	./modules/Test/views
		song.html
		artist.html
				
### Separated views
	./modules/Test/Song
		song.controller.js
		listen.directive.js
		song.html
	./modules/Test/Artist
		artist.controller.js
		rating.directive.js
		vote.service.js
		artist.html
	
Both of these approaches will compile and work as expected without changing any configurable options.

## Features
Out of the box angular-fresh comes with the following features:

 - IE8 compatable
 - Bootstrap enabled
 - JS validation
 - TypeScript compiler
 - Configuration file to store settings
 - REST/API integration ready
 - Modular and segregated approach
 - Flexible file structure

#### License ####
MIT License
