/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

// Validator/Reflector Lambda Function code for Alexa.
// Paste this into your index.js file. 

const Alexa = require("ask-sdk");

const DIALOG_DIRECTIVE_SUPPORT = true;

// Session Attributes 
//   Alexa will track attributes for you, by default only during the lifespan of your session.
//   The history[] array will track previous request(s), used for contextual Help/Yes/No handling.
//   Set up DynamoDB persistence to have the skill save and reload these attributes between skill sessions.

function getMemoryAttributes() {   const memoryAttributes = {
       "history": [],
       "launchCount": 0,
       "lastUseTimestamp": 0,
       "lastSpeechOutput": {}
   };
   return memoryAttributes;
};

const maxHistorySize = 20; // remember only latest 20 intents 


// Intent Handlers =============================================

const LaunchRequestHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'LaunchRequest. ' + `Locale is ${sessionAttributes.locale}. `;;

        if (supportsDisplay(handlerInput)) {
            const myImage1 = new Alexa.ImageHelper()
               .addImageInstance(DisplayImg1.url)
               .getImage();

            const myImage2 = new Alexa.ImageHelper()
               .addImageInstance(DisplayImg2.url)
               .getImage();

            const primaryText = new Alexa.RichTextContentHelper()
               .withPrimaryText(say)
               .getTextContent();

            responseBuilder.addRenderTemplateDirective({
               type : 'BodyTemplate2',
               token : 'string',
               backButton : 'HIDDEN',
               backgroundImage: myImage2,
               image: myImage1,
               title: 'LaunchRequest',
               textContent: primaryText,
             });
        }
        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withStandardCard('LaunchRequest', say, welcomeCardImg.smallImageUrl, welcomeCardImg.largeImageUrl)
            .getResponse();
    },
};

const CancelIntentHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'AMAZON.CancelIntent. Bye! ';

        let history = sessionAttributes['history'];
        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
             say += 'Previous intent was ' + previousIntent + '. ';
        }

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const StopIntentHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'AMAZON.StopIntent. Bye! ';

        let history = sessionAttributes['history'];
        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
             say += 'Previous intent was ' + previousIntent + '. ';
        }

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    }
};

const HelpIntentHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'AMAZON.HelpIntent. ';

        let history = sessionAttributes['history'];
        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
             say += 'Previous intent was ' + previousIntent + '. ';
        }

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const NavigateHomeIntentHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'AMAZON.NavigateHomeIntent. ';

        let history = sessionAttributes['history'];
        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
             say += 'Previous intent was ' + previousIntent + '. ';
        }

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const FallbackIntentHandler = {
    // AMAZON.FallbackIntent is only currently available in en-US locale.
    // This handler will not be triggered except in that locale, so it can be
    // safely deployed for any locale.
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'AMAZON.FallbackIntent. ';

        let history = sessionAttributes['history'];
        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
             say += 'Previous intent was ' + previousIntent + '. ';
        }

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
  };

const ReflectorIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest';
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      const responseBuilder = handlerInput.responseBuilder;
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      const currentIntent = request.intent; 

      if(DIALOG_DIRECTIVE_SUPPORT && request.dialogState && request.dialogState !== 'COMPLETED') { 
        return handlerInput.responseBuilder
            .addDelegateDirective(currentIntent)
            .getResponse();
      } 

      let say = `${currentIntent.name}. `;
      const slotsInRequest = handlerInput.requestEnvelope.request.intent.slots;
      if (slotsInRequest) {
        const slotValues = getSlotValues(slotsInRequest);
        say += `Slots, `;
        Object.keys(slotValues).forEach((item) => {
          const name = item; 
          const value = slotValues[item].value || 'empty'; 
          const synonym = slotValues[item].synonym || 'empty'; 
          say += `${name} is ${value} `;
          if (synonym != value) {
            say += `via synomym ${synonym}`;
          }
          say += '. ';
        });
      }

      let history = sessionAttributes['history'];
      let previousIntent = getPreviousIntent(sessionAttributes);
      if (previousIntent && !handlerInput.requestEnvelope.session.new) {
        say += 'Previous intent was ' + previousIntent + '. ';
      }

      if (supportsDisplay(handlerInput)) {
        const myImage1 = new Alexa.ImageHelper()
           .addImageInstance(DisplayImg1.url)
           .getImage();

        const myImage2 = new Alexa.ImageHelper()
           .addImageInstance(DisplayImg2.url)
           .getImage();

        const primaryText = new Alexa.RichTextContentHelper()
           .withPrimaryText(say)
           .getTextContent();

        responseBuilder.addRenderTemplateDirective({
           type : 'BodyTemplate2',
           token : 'string',
           backButton : 'HIDDEN',
           backgroundImage: myImage2,
           image: myImage1,
           title: 'LaunchRequest',
           textContent: primaryText,
         });
      }

      return responseBuilder
        .speak(say)
        .reprompt('try again, ' + say)
        .withStandardCard(currentIntent.name, say, welcomeCardImg.smallImageUrl, welcomeCardImg.largeImageUrl)
        .getResponse();
    }
};

const SessionEndedHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const GenericErrorHandler =  {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;
        console.log(`Error handled: ${error.message}`);
        // console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
        return handlerInput.responseBuilder
            .speak(`Sorry, your skill got this error.  ${error.message} `)
            .reprompt(`Sorry, your skill got this error.  ${error.message} `)
            .getResponse();
    }
};

const RequestHandlerChainErrorHandler = {
    canHandle(handlerInput, error) {
      return error.message === `RequestHandlerChain not found!`;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
      return handlerInput.responseBuilder
        .speak(`Oops! Looks like you forgot to register a handler.`)
        .getResponse();
    },
  };

// Helper Functions ===================================================================

function getSlotValues(filledSlots) {
    const slotValues = {};
  
    console.log(`The filled slots: ${JSON.stringify(filledSlots)}`);
    Object.keys(filledSlots).forEach((item) => {
      const name = filledSlots[item].name;
  
      if (filledSlots[item] &&
        filledSlots[item].resolutions &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0] &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status &&
        filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
        switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) {
          case 'ER_SUCCESS_MATCH':
            slotValues[name] = {
              synonym: filledSlots[item].value,
              value: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name,
              id: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id,
              isValidated: true,
              canUnderstand: true,
              canFulfill: true,
            };
            break;
          case 'ER_SUCCESS_NO_MATCH':
            slotValues[name] = {
              synonym: filledSlots[item].value,
              value: filledSlots[item].value,
              id: null,
              isValidated: false,
              canUnderstand: false,
              canFulfill: null,
            };
            break;
          default:
            break;
        }
      } else {
        slotValues[name] = {
          synonym: filledSlots[item].value,
          value: filledSlots[item].value,
          id: filledSlots[item].id,
          isValidated: false,
          canUnderstand: false,
          canFulfill: false,
        };
      }
    }, this);
    return slotValues;
}

function supportsDisplay(handlerInput) // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.) 
{                                      //  Enable your skill for display as shown here: https://alexa.design/enabledisplay 
    const hasDisplay = 
        handlerInput.requestEnvelope.context && 
        handlerInput.requestEnvelope.context.System && 
        handlerInput.requestEnvelope.context.System.device && 
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces && 
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display; 
    return hasDisplay; 
} 
 
const welcomeCardImg = { 
    smallImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane720_480.png", 
    largeImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane1200_800.png" 
}; 
 
const DisplayImg1 = { 
    title: 'Jet Plane', 
    url: 'https://s3.amazonaws.com/skill-images-789/display/plane340_340.png' 
}; 
const DisplayImg2 = { 
    title: 'Starry Sky', 
    url: 'https://s3.amazonaws.com/skill-images-789/display/background1024_600.png' 
}; 
 
function getPreviousIntent(attrs) { 
    if (attrs.history && attrs.history.length > 1) { 
        return attrs.history[attrs.history.length - 2].IntentRequest; 
    } else { 
        return false; 
    } 
} 
 
function getPreviousSpeechOutput(attrs) { 
    if (attrs.lastSpeechOutput && attrs.history.length > 1) { 
        return attrs.lastSpeechOutput; 
    } else { 
        return false; 
    } 
} 
 
function timeDelta(t1, t2) { 
    const dt1 = new Date(t1); 
    const dt2 = new Date(t2); 
    const timeSpanMS = dt2.getTime() - dt1.getTime(); 
    const span = { 
        "milliseconds": Math.floor(timeSpanMS), 
        "seconds": Math.floor(timeSpanMS / (1000 )), 
        "minutes": Math.floor(timeSpanMS / (1000 * 60 )), 
        //"hours": Math.floor(timeSpanMS / (1000 * 60 * 60)), 
        //"days": Math.floor(timeSpanMS / (1000 * 60 * 60 * 24)) 
    }; 
    return span; 
} 
 
const InitMemoryAttributesInterceptor = { 
    process(handlerInput) { 
        let sessionAttributes = {}; 
        if(handlerInput.requestEnvelope.session['new']) { 
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
            let memoryAttributes = getMemoryAttributes(); 
            if(Object.keys(sessionAttributes).length === 0) { 
                Object.keys(memoryAttributes).forEach(function(key) {  // initialize all attributes from global list 
                    sessionAttributes[key] = memoryAttributes[key]; 
                }); 
            } 
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
        } 
    } 
}; 
 
const RequestHistoryInterceptor = { 
    process(handlerInput) { 
        const thisRequest = handlerInput.requestEnvelope.request; 
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        let history = sessionAttributes['history'] || []; 
        let IntentRequest = {}; 
        if (thisRequest.type === 'IntentRequest' ) { 
            let slots = []; 
            IntentRequest = { 
                'IntentRequest' : thisRequest.intent.name 
            }; 
            if (thisRequest.intent.slots) { 
                for (let slot in thisRequest.intent.slots) { 
                    let slotObj = {}; 
                    slotObj[slot] = thisRequest.intent.slots[slot].value; 
                    slots.push(slotObj); 
                } 
                IntentRequest = { 
                    'IntentRequest' : thisRequest.intent.name, 
                    'slots' : slots 
                }; 
            } 
        } else { 
            IntentRequest = {'IntentRequest' : thisRequest.type}; 
        } 
        if(history.length > maxHistorySize - 1) { 
            history.shift(); 
        } 
        history.push(IntentRequest); 
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
    } 
};

const ResponseRecordSpeechOutputInterceptor = { 
    process(handlerInput, responseOutput) { 
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        let lastSpeechOutput = { 
            "outputSpeech":responseOutput.outputSpeech ? responseOutput.outputSpeech.ssml : null, 
            "reprompt":responseOutput.reprompt ? responseOutput.reprompt.outputSpeech.ssml : null, 
        }; 
        sessionAttributes['lastSpeechOutput'] = lastSpeechOutput; 
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
    } 
}; 
 
/*const RequestPersistenceInterceptor = { 
    process(handlerInput) { 
        if(handlerInput.requestEnvelope.session['new']) { 
            return new Promise((resolve, reject) => { 
                handlerInput.attributesManager.getPersistentAttributes() 
                    .then((sessionAttributes) => { 
                        sessionAttributes = sessionAttributes || {}; 
                        sessionAttributes['launchCount'] += 1; 
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
                        handlerInput.attributesManager.savePersistentAttributes() 
                            .then(() => { 
                                resolve(); 
                            }) 
                            .catch((err) => { 
                                reject(err); 
                            }); 
                    }); 
            }); 
        } // end session['new'] 
    } 
};
 
const ResponsePersistenceInterceptor = { 
    process(handlerInput, responseOutput) { 
        const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession); 
        if(ses || handlerInput.requestEnvelope.request.type == 'SessionEndedRequest') { // skill was stopped or timed out 
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
            sessionAttributes['lastUseTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).getTime(); 
            handlerInput.attributesManager.setPersistentAttributes(sessionAttributes); 
            return new Promise((resolve, reject) => { 
                handlerInput.attributesManager.savePersistentAttributes() 
                    .then(() => { 
                        resolve(); 
                    }) 
                    .catch((err) => { 
                        reject(err); 
                    }); 
            }); 
        } 
    } 
};*/

const TimestampRequestInterceptor = {
    process(handlerInput, responseOutput) { 
        const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession); 
        if(ses || handlerInput.requestEnvelope.request.type == 'SessionEndedRequest') { // skill was stopped or timed out 
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
            //sessionAttributes['lastUseTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).getTime();
            sessionAttributes['lastUseTimestamp'] = new Date().toISOString();
            sessionAttributes['timeDelta'] = timeDelta(handlerInput.requestEnvelope.request.timestamp, sessionAttributes['lastUseTimestamp']);
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        } 
    } 
};

const LocaleRequestInterceptor = {
    process(handlerInput) {
      const requestLocale = handlerInput.requestEnvelope.request.locale;
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      sessionAttributes.locale = requestLocale;
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
      console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.standard();
exports.handler = skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        CancelIntentHandler, 
        HelpIntentHandler, 
        StopIntentHandler, 
        NavigateHomeIntentHandler, 
        ReflectorIntentHandler,
        FallbackIntentHandler,
        SessionEndedHandler
    )
    .addErrorHandlers(GenericErrorHandler)
    .addRequestInterceptors(InitMemoryAttributesInterceptor)
    .addRequestInterceptors(RequestHistoryInterceptor)
    .addRequestInterceptors(LocaleRequestInterceptor)
    .addRequestInterceptors(LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .addResponseInterceptors(ResponseRecordSpeechOutputInterceptor)
    .addResponseInterceptors(TimestampRequestInterceptor)
    // .addRequestInterceptors(RequestPersistenceInterceptor)
    // .addResponseInterceptors(ResponsePersistenceInterceptor)
    // .withTableName("reflectorTable")
    // .withAutoCreateTable(true)
    .lambda();