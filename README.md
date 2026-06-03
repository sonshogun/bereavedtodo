# Build Instructions

##  First need to install npm 

    https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/
    
    and Install Vercel globally 

    ```npm install -g vercel```

## Second we need to independently start the python backend ( will default at 8000 )

    From the api folder unde fastapi-react-app ( in a seperate admin powershell )

        ```python3 -m venv venv 
        .\venv\Scripts\activate.ps1```

        Then in the virtual environment 

        ```pip install -r  .\requirements.txt```
        
        And finally to run 

        ```uvicorn index:app --reload```

## Third we get the front end running ( much quicker we use Vercel )

    From the fastapi-react-app folder run 

    ```vercel dev --local-config vercel.local.json --debug```
