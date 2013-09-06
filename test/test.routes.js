var should = require('should'),
    routes = require('../routes');

describe('Routes', function() {
    "use strict";

    describe("#errorPage", function(done) {
        var mockRes, mockReq, msg;
        
        msg = "An error occured";
        mockRes = {
            writeHead: function writeHead(code, obj) {
                code.should.be.eql(500);
            },
            
            end: function writeHead(content) {
                content.should.include(msg);
            } 
        };
        
        it('should load error page', function() {
            routes.errorPage(null, mockRes, msg);
        });
    });
    
    
    describe("#parseUrl", function(done) {
        var url = 'http://www.youtube.com/watch?v=gXGLGVWWwKI', id;
        
        it('should return YouTube video ID', function() {
            id = routes.parseUrl(url);
            
            id.should.be.eql('gXGLGVWWwKI');
        });
    });
    
    
    describe("#parseFilename", function(done) {
        var title = 'My Awesome video!!!', filename;
        
        it('should clean a video title, remove unwanted chars returns a video filename', function() {
            filename = routes.parseFilename(title, 'mp4');
            
            filename.should.be.eql('My-Awesome-video.mp4');
        });
    });
});