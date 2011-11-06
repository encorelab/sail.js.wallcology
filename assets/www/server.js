var sail = require('./js/sail.js/sail.node.server.js')

var url = require('url')

var UIC_MICROWORLDS_URL = "http://ltg.evl.uic.edu:80/"

sail.server.proxyMap.unshift(
    {
        name: 'UIC-MICROWORLDS',
        match: function(req) { return url.parse(req.url).pathname.match(/^\/uic/) },
        proxy: function(req, res) {
            uicUrl = url.parse(UIC_MICROWORLDS_URL)
            req.url = req.url.replace(/^\/uic/,'')
            console.log("PROXY "+req.url+" ==> "+UIC_MICROWORLDS_URL)
            sail.server.proxy.proxyRequest(req, res, {
                host: uicUrl.hostname,
                port: uicUrl.port || 80
            })
        }
    }
)

sail.server.start(8000)
