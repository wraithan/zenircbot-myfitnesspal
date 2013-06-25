var ZenIRCBot = require('zenircbot-api').ZenIRCBot
  , scrapeit = require('scrapeit')
  , zen = new ZenIRCBot()

zen.register_commands(
  "myfitnesspal.js"
, [{
    name: "!calories"
  , description: "Lets you know your calories so far."
  }]
)

var url = 'http://www.myfitnesspal.com/food/diary/'
  , user = 'Wraithan'
  , fullUrl = url + user


var filtered = zen.filter({version: 1, type: 'directed_privmsg'})
filtered.on('data', function(msg){
  if (/^calories$/i.test(msg.data.message)) {
    scrapeit(fullUrl, function(err, o, dom) {
      if (!err) {
        var tags = ['Today', 'Goal', 'Remaining']
          , response = ''
        o('tr.total').forEach(function(tr, idx) {
          var count = 0
          response += tags[idx] + ': '
          tr.children.forEach(function(td) {
            if (count < 2) {
              if (td.type === 'tag' && td.name === 'td') {
                if (count === 1) {
                  response += td.children[0].data.trim()
                }
                count++
              }
            }
          })
          if (idx < 2) {
            response += ' | '
          }
        })
        zen.send_privmsg(msg.data.channel, response)
        console.log(response)
      }
    })
  }
})
