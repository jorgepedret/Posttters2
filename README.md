Posttters2
==========
Local posters of stuff that you love

Stack structure and libraries
-----------------------------

**On the server side:**
- Node.js for server side interactions and serving HTML
- Express as http server and Restful API responses
- MongoDB to store persistent data
- Mongoose as an interface for MongoDB and collections schemas
- Slugs a helper module that generates slugs from strings

**On the client side:**
- Backbone.js as an MV* framework
- Underscore for templating and utilities library
- Require.js for modules and async loading of files
- jQuery for manipulating the DOM

Stack execution steps
---------------------

- User requests page from browser
- Request is processed by node
- Express interpretes the request
- Node outputs the skeleton for the site (considering is not an api request)
- Require.js is loaded at the footer of the document
- /public/js/main.js is loaded, which loads the basic libraries and the Backbone router
- The router interprets the url and triggers its respective method, generally methods in the main app view (/public/js/views/app.js)

File & directory structure
--------------------------

	public/
	  css/
			posttters.css  /* Stylus generated file */
			posttters.styl /* Stylus CSS source file */
		fonts/
		img/
		js/
			collections/
				posters.js
			libs/
				backbone/
					backbone.js
				jquery/
					jquery.js
				require/
					require.js
					text.js
				underscore/
					underscore.js
			models/
				poster.js
			templates/
				posters/
					item.html
					list.html
					single.html
					new.html
			views/
				posters/
					item.js
					list.js
					single.js
					new.js
	      app.js
			main.js
			router.js
	views/
		layout.html
	app.js



Models
------
- Poster
- Comment [todo]
- Tag [todo]
- User [todo]

Collections
-----------
- Posters
- Comments [todo]
- Tags [todo]