# TRM Backend

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Structue](#structure)
- [Important notes](#important notes)
- [Contributing](#contributing)

## Installation

Clone the project and run: 
```
npm run install
```

To be able to run this project you'll need these dependencies:

- mongoDB (**v. ^3.2**) running under 127.0.0.1:27017 (default)

- ffmpeg library

- .env file (that contains passwords) in project root directory



## Usage

Before running the project you can populate db with a seed data using this command:

(it will erase db initially - do not use on uat or prod)

```
npm run populate
```

To run project in development mode use:
```
npm run dev
```

I recommend using [Postman](https://www.getpostman.com/) for testing the endpoints.


Other useful commands (mostly for deployment):

`npm start` - running in forever mode

`npm run stop` - stop running in forever mode

`npm run restart` - restart in forever mode

## Structure

Project have following structure

```
  .
  │                            
  ├── client                        # Contains FE files where index.js is served 
  │                                 # on every route for client side routing to 
  │                                 # work. On /api/v1 routes index.js isn't served
  │                            
  ├── config                        # Contains configuration data for different 
  │                                 # environements for more details see docs: 
  │                                 # https://github.com/lorenwest/node-config
  │                            
  ├── public                        # Files accesible for the FE and are tracked
  │                                 # by git. e.g. placeholder images.
  │                            
  ├── samples                       # Sample files usefull to test requests
  │                            
  ├── seed                          # Files used in populate script to seed the db
  │                                 # with the inintial data
  │                            
  ├── server                        # Backend source code
  │   │                             
  │   ├── api                       # Cantains all endpoint controlers, models and
  │   │   │                         # routes structured in a way so main folder names 
  │   │   │                         # will represent actual endpoint url structure
  │   │   │                         
  │   │   ├── endpointName          # Endpoint will be accesible from the browser 
  │   │   │   │                     # respectively under /api/v1/[endpointName]
  │   │   │   │                      
  │   │   │   ├── controller        # Contains promise-based async functions that
  │   │   │   │                     # are building blocks for [endpointName] routes.
  │   │   │   │                     # Object that's finally exported derives from
  │   │   │   │                     # generic Controller class which puts some 
  │   │   │   │                     # abstraction on top of mongoose
  │   │   │   │                      
  │   │   │   ├── model             # Contains endpoint related mongoose model
  │   │   │   │                      
  │   │   │   ├── utils             # Contains endpoint related utility functions
  │   │   │   │                     # that do not fall into general utility category 
  │   │   │   │                         
  │   │   │   ├── routes            # Contains inner endpoints that follow the same 
  │   │   │   │                     # structure as [endpointName] folder. 
  │   │   │   │                     # They are accessible from the browser under
  │   │   │   │                     # /api/v1/[endpointName]/[innerEndpointName]
  │   │   │   │                      
  │   │   │   └── routes.js         # Exposes endpoints using controllers converted    
  │   │   │                         # to express midlleware via applyController util
  │   │   │                         
  │   │   ├── permissions           # Registers permissions that can be later used
  │   │   │                         # as an express midleware on routes 
  │   │   │                         
  │   │   └── utils                 # Contains utils that are related to api and do
  │   │                             # not fall into general utility category 
  │   │                         
  │   ├── data                      # Contains static text data constants and function 
  │   │                             # helpers for generating responses    
  │   │                         
  │   ├── scripts                   # Contains smaller independent utility scripts
  │   │   │                         
  │   │   └── scriptName            # Scripts are always in separate folders
  │   │       │                      
  │   │       └── index.js          # Requires 'babel-register' for absolute paths to
  │   │                             # work. It does that by requiring either 'setup' 
  │   │                             # or 'setup/base'. Then it has to require actual
  │   │                             # script as a separate file
  │   │                             
  │   ├── setup                     # Contains various setup scripts from which 'base'
  │   │                             # is the most important as it sets up absolute 
  │   │                             # paths (from 'server' directory perspective) and  
  │   │                             # other usefull things. The 'index.js' file  
  │   │                             # opens db connection on top of it. Rest of the 
  │   │                             # files is independent 
  │   │                             
  │   ├── utils                     # Contains various generic utility functions used
  │   │                             # throughout the project
  │   │                             
  │   └── index.js                  # Requires 'setup' for absolute paths to work and
  │                                 # to open db connection. After that runs 
  │                                 # 'server.js' that is the starting point of the
  │                                 # actual backend
  │                                
  ├── uploads                       # Not tracked by git. Contains files uploaded by
  │                                 # user or populated via scripts. Those file paths
  │                                 # are stored in db as strings. Files are 
  │                                 # automatically deleted on path change in db. 
  │                                  
  └── .env                          # Not tracked by git. Contains sensitive 
                                    # information like passwords and api keys.  
                                    # Also on DEV and UAT environement has to have  
                                    # NODE_PATH as well. If NODE_PATH is not present
                                    # local environment is assumed
                                    
```

## Important notes

- Please do not force commit if pre-commit hook fails
  
    - If you have spacing errors use `npm run lint` to fix them 
  
- Please do not use relative paths like `require('../../something')`

    - There is babel module resolver configured that takes `./server` folder as a base directory
  
- Please remember to always run npm scripts from root project directory

- To access cron job on DEV or UAT use linux 'screen' util
    
    - screen -r (to enter the cron screen)
    - screen -d (to leave cron screen)

## Contributing

To contribute follow these steps:

- create a branch based on latest commit of current sprint branch 
    
    -  with this naming convention `feature-trm[jira task number]`
    
- add some commits

- open pull request

- assign and ask someone to review it