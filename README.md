# D.I.C.E._L_Mart
69 - No raven

# Firebase
To switch between staging and production, use:  
`firebase use default` for staging  
`firebase use prod` for production  
Warning: production project is not defined nor setup yet  

# Running on local
To run the website on a local server, Firebase CLI and Java needs to be installed.  
Note: Ensure that firebase is using the staging with `firebase use default` before running the server.  
Use `firebase emulators:start` to run Firebase on a local server.  
Using default configurations, open [http://127.0.0.1:5000](http://127.0.0.1:5000) to view the website.

By running `firebase emulators:start`, information about the emulators will be shown.  
You can view the local Firestore data with the Emulator UI linked in the output using the above command.

## Running on local using persistent data
Running `firebase emulators:start` every time will not save or load a previous session's emulated data.  
Current data running on firebase can be exported using `firebase emulators:export <location>`, and imported using `firebase emulators:start --import <location>`.
