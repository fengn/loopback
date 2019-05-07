'use strict';

module.exports = function(Cat) {

    Cat.adoptable = function(id, cb) {
        Cat.observe('before save', function(context, next) {
            if(context.instance) context.instance.updated = new Date();
            next();
        });
        Cat.afterRemote('findById', function(context, cat, next) {
            cat.description = cat.name + ' is ' + cat.age + ' years old and is a ' + cat.breed;
            next();
        });
        Cat.findById(id, function(err, cat) {
            if(err) return cb("Error", null);            
            if(!cat) return cb("Cat not found", null);
            let canAdopt = false;
            if(cat.breed != 'tiger' || (cat.age >= 10))
            canAdopt = true;
            cb(null, canAdopt);            
        });
    }
    Cat.remoteMethod('adoptable', {
        accepts: {arg: 'id', type:'any'},
        returns: {arg:'adoptable', type:'boolean'}
    });
};
