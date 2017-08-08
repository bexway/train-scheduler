# Train Scheduler
A train scheduling app, that stores information about trains and arrival times in a [Firebase Database](https://firebase.google.com/).

A real-time updated clock is in the header, and the arrival times are updated every minute. (Specifically when the client's computer clock changes minute, as calculated using the time functions in JS.) New trains can be submitted through the form at the bottom of the page. Trains can be deleted using the icon next to them in the train listing table.

Firebase's functions activate when a new train is added or removed to update the list from any user with permission to write to the database. When a change is made, that change is updated for any user accessing the scheduler.

To use the app, a Firebase database must be provided. To do so, create a Firebase project, find the snipper for adding the database to a web app, and place the `config` variable in a js file named `config.js` in the assets folder. The `config` variable should look like the following, filled in with data from your Firebase project:

```javascript
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
```

## Future Development

I would like to create an offline component using local storage to store the database. Whenever connection is re-established, the next database submission or arrival time update would also update the database. This would allow the app to be used without an internet connection, or without a Firebase database.
