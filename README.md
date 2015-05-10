# pg-barnum
"There's a sucker born every minute"

## Possible Syntax

Loosely based on Waterline

```js
{
  attributes: {
    username: 'string',
    
    password: {
      type: 'string',
      min: 8
    }
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
