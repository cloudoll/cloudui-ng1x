var cloudoll = require('cloudoll');

module.exports = {
    list: function *() {
        var list = [];
        for(var i=0;i<10;i++){
        	var item = {};
        	item.name = "name" + i;
        	item.version = "version";
        	item.creater = "creater";
        	item.updateDate = new Date();
        	item.state = "state"

        	list.push(item);
        }
        this.body = {total: 100, rows:  list };

        // var service = "cloudarling";
        // var url = "/admin/account/list";
        // var form     = this.request.body;
        // this.body = yield cloudoll.Cloudeer.invokeCo("GET", service, url, form.params);
    }
};
