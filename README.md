
NodeTube is a Node.js app for downloading YouTube videos. [Go to App](http://nodetube.ragingflame.co.za) .


## Installation

[![Greenkeeper badge](https://badges.greenkeeper.io/qawemlilo/nodetube.svg)](https://greenkeeper.io/)

```
# Download the package
git clone https://github.com/qawemlilo/nodetube.git

# Install the app
cd nodetube && npm install
```

## Wep App

Run the command below and then go to http//localhost:3030 to use the web app.

```
# Run the app
node app.js
```

## Batch downloads

For batch downloads, in config.json, set the path for the downloads folder and list all your video URLs in the videos array.

```
# Batch downloads
node batch.js
```

## Testing

```
npm test
```


## Dependencies
 - [ytdl-core](https://github.com/fent/ytdl-core)
 - [connect](http://www.senchalabs.org/connect)




## License

(MIT License)

Copyright (c) 2013 Qawelesizwe Mlilo <qawemlilo@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

