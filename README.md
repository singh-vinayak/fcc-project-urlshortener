# [API Project: URL Shortener Microservice for freeCodeCamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice)

### [Link for the project](https://fcc-url-shortener-project.herokuapp.com/)


## How To Use

> I can POST a URL to [project_url]/api/shorturl/ and I will receive a shortened URL in the JSON response. Example : {"original_url":"www.google.com","short_url":1}
> If I pass an invalid URL that doesn't follow the valid http(s)://www.example.com(/more/routes) format, the JSON response will contain an error like {"error":"invalid URL"}. HINT: to be sure that the submitted url points to a valid site you can use the function dns.lookup(host, cb) from the dns core module.
> When I visit the shortened URL, it will redirect me to my original link.

### Creation Example:

POST [project_url]/api/shorturl/ - body (urlencoded) : url=https://www.google.com

### Usage:

[this_project_url]/api/shorturl/2uUsP

i.e. https://polar-flare.glitch.me/api/shorturl/2uUsP

### Will redirect to:

https://www.google.com
