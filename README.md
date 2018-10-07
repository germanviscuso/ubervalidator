# ubervalidator
Alexa backend for Node.js that give you all sorts of debugging information via voice
## Installation
1. Create an AWS Lambda function from scratch (no blueprints or repos) in a supported Alexa region (eg. N. Virginia or Ireland).
    1. Enter a name for the function (e.g. ubervalidator)
    2. Choose node.js v8.10
    3. In roles select *Create a custom role*. A new tab will open and there just click on *Allow* in the bottom right corner
    4. Click on *Create Function*
2. Configure the Lambda function to support Alexa
    1. Once the lambda is created you'll see the designer view of the function. On the left click on *Alexa Skills Kit*
    2. You will probably want to disable *Skill ID Verification* since this validator function is usually used across multiple skills for testing (otherwise enable it and enter a specific skill ID)
    3. Click on *Add* in the bottom right (keep this tab open while you complete the steps below)
3. Upload the lambda function code with dependencies
    1. Clone this repo and do `npm install` on the root directory
    2. Zip the project doing `zip -r ../ubervalidator.zip .`
    3. Switch back to the tab of the previous step. In teh designer view click on the top level box with the name of your fucntion (e.g. ubervalidator)
    4. Change the combo *Code Entry Type* from *Edit Code Inline* to *Upload a .zip file*
    5. Choose the zip file you just created and *Save* the function
    6. Copy the ARN address at the top right and add it as endpoint to your Alexa skill

Done!
