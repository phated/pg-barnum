# pg-barnum
"There's a sucker born every minute"

## Possible Syntax

Loosely based on Waterline

```js
{
  attributes: {
    // plain values are used
    name: 'Firstname Lastname',
    // functions get executed
    username: function(){
      return this.name.split(' ').join('.');
    },
    // templates get interpolated
    password: '<%= username + "Password" %>'
  },

  before: function(client, data, cb){
    // allow callback or returning promise
  },

  after: function(client, record, cb){
    // allow callback or returning promise
  }
}
```

## Wishlist

* Only PostgresSQL support (supporting other libraries generates worse code)
* Integrate Factories, Fixtures and Migrations into 1 library
* Lifecycle hooks (before, after, etc)
* Plain JS objects where possible (no classes/constructors)
* Template support (lodash templates?)
* __Very__ good relation support
* Generator (based off a template schema?)
* Transaction support (if possible)
* Good PostGIS support
