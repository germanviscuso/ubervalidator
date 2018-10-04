/* eslint-disable  func-names */
/* eslint-disable  no-console */
/* eslint-disable  no-restricted-syntax */

// Validator/Reflector Lambda Function code for Alexa.
// Paste this into your index.js file. 

const Alexa = require("ask-sdk");
const i18n = require('i18next');	
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
  'en' : require('./i18n/en'),
  'en-GB' : require('./i18n/en-GB'),
  'es' : require('./i18n/es'),
  'es-MX' : require('./i18n/es-MX'),
  'it' : require('./i18n/it'),
  'fr' : require('./i18n/fr')
}

const ENABLE_DIALOG_DIRECTIVE_SUPPORT = true;
const ENABLE_INTENT_HISTORY_SUPPORT = true;
const MAX_HISTORY_SIZE = 3; // remember only latest 3 intents 

// Session Attributes 
//   Alexa will track attributes for you, by default only during the lifespan of your session.
//   The history[] array will track previous request(s), used for contextual Help/Yes/No handling.
//   Set up DynamoDB persistence to have the skill save and reload these attributes between skill sessions.

function getMemoryAttributes() {  
    const memoryAttributes = {
       "history": [],
       "launchCount": 0,
       "lastUseTimestamp": 0,
       "lastSpeechOutput": {}
    };
   return memoryAttributes;
};

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('LAUNCH_REQUEST') + '. ' + requestAttributes.t('LOCALE_IS') + ` ${sessionAttributes.locale}. `;

        // Dummy multimodal output for testing purposes
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
               title: requestAttributes.t('LAUNCH_REQUEST'),
               textContent: primaryText,
             });
        }

        return responseBuilder
            .speak(say)
            .reprompt(requestAttributes.t('TRY_AGAIN') + ', ' + say)
            .withStandardCard(requestAttributes.t('LAUNCH_REQUEST'), say, welcomeCardImg.smallImageUrl, welcomeCardImg.largeImageUrl)
            .getResponse();
    }
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('CANCEL_INTENT') + '. ';

        if(ENABLE_INTENT_HISTORY_SUPPORT){
            let previousIntent = getPreviousIntent(sessionAttributes);
            if (previousIntent && !handlerInput.requestEnvelope.session.new) {
                say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
            }
        }

        say += requestAttributes.t('GOODBYE') + '. ';

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('STOP_INTENT') + '. ';

        if(ENABLE_INTENT_HISTORY_SUPPORT){
            let previousIntent = getPreviousIntent(sessionAttributes);
            if (previousIntent && !handlerInput.requestEnvelope.session.new) {
                say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
            }
        }

        say += requestAttributes.t('GOODBYE') + '. ';

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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('HELP_INTENT') + '. ';

        if(ENABLE_INTENT_HISTORY_SUPPORT){
            let previousIntent = getPreviousIntent(sessionAttributes);
            if (previousIntent && !handlerInput.requestEnvelope.session.new) {
                say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
            }
        }

        return responseBuilder
            .speak(say)
            .reprompt(requestAttributes.t('TRY_AGAIN') + ', ' + say)
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('NAVIGATE_HOME_INTENT') + '. ';

        if(ENABLE_INTENT_HISTORY_SUPPORT){
            let previousIntent = getPreviousIntent(sessionAttributes);
            if (previousIntent && !handlerInput.requestEnvelope.session.new) {
                say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
            }
        }

        return responseBuilder
            .speak(say)
            .reprompt(requestAttributes.t('TRY_AGAIN') + ', ' + say)
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('FALLBACK_INTENT') + '. ';

        if(ENABLE_INTENT_HISTORY_SUPPORT){
            let previousIntent = getPreviousIntent(sessionAttributes);
            if (previousIntent && !handlerInput.requestEnvelope.session.new) {
                say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
            }
        }

        return responseBuilder
            .speak(say)
            .reprompt(requestAttributes.t('TRY_AGAIN') + ', ' + say)
            .getResponse();
    }
};

const CatchAllIntentHandler = {
    canHandle(handlerInput) {
      return true;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        let say = requestAttributes.t('CATCH_ALL_INTENT') + '. ';

        if(ENABLE_INTENT_HISTORY_SUPPORT){
            let previousIntent = getPreviousIntent(sessionAttributes);
            if (previousIntent && !handlerInput.requestEnvelope.session.new) {
                say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
            }
        }

        return responseBuilder
            .speak(say)
            .reprompt(requestAttributes.t('TRY_AGAIN') + ', ' + say)
            .getResponse();
    }
}

const DialogueIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' &&
            ENABLE_DIALOG_DIRECTIVE_SUPPORT && 
            request.dialogState && 
            request.dialogState !== 'COMPLETED';
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      const responseBuilder = handlerInput.responseBuilder;
      const currentIntent = request.intent; 

      return responseBuilder
        .addDelegateDirective(currentIntent)
        .getResponse();
    }
}

const ReflectorIntentHandler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest';
    },
    handle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      const responseBuilder = handlerInput.responseBuilder;
      let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

      const currentIntent = request.intent; 

      let say = `${currentIntent.name}. `;
      const slotsInRequest = handlerInput.requestEnvelope.request.intent.slots;
      if (slotsInRequest) {
        const slotValues = getSlotValues(slotsInRequest);
        say += requestAttributes.t('SLOTS') + ', ';
        Object.keys(slotValues).forEach((item) => {
          const name = item; 
          const value = slotValues[item].value || requestAttributes.t('EMPTY'); 
          const synonym = slotValues[item].synonym || requestAttributes.t('EMPTY'); 
          if(slotValues[item].canFulfill == false){
            say += `${name} ` + requestAttributes.t('IS') + ` ${value}`;
          } else {
            say += `${name} ` + requestAttributes.t('RESOLVED_TO') + ` ${value}`;
            if (synonym != value) {
                say += ' ' + requestAttributes.t('VIA_SYNONYM') + ` ${synonym}`;
            }
          }
          say += '. ';
        });
      }

      if(ENABLE_INTENT_HISTORY_SUPPORT){
        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
            say += requestAttributes.t('PREVIOUS_INTENT_WAS') + ' ' + previousIntent + '. ';
        }
      }

      // Dummy multimodal output for testing purposes
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
           title: `${currentIntent.name}`,
           textContent: primaryText,
         });
      }

      return responseBuilder
        .speak(say)
        .reprompt(requestAttributes.t('TRY_AGAIN') + ', ' + say)
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
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        console.log(`Error handled: ${error.message}`);
        // console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
        return handlerInput.responseBuilder
            .speak(requestAttributes.t('SORRY_SKILL_GOT_THIS_ERROR') + `.  ${error.message} `)
            .reprompt(requestAttributes.t('SORRY_SKILL_GOT_THIS_ERROR') + `.  ${error.message} `)
            .getResponse();
    }
};

const RequestHandlerChainErrorHandler = {
    canHandle(handlerInput, error) {
      return error.message === `RequestHandlerChain not found!`;
    },
    handle(handlerInput, error) {
      const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
      console.log(`Error handled: ${error.message}`);
      return handlerInput.responseBuilder
        .speak(requestAttributes.t('FORGOT_REGISTER_HANDLER'))
        .getResponse();
    }
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

function supportsDisplay(handlerInput){ // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.) 
                                        //  Enable your skill for display as shown here: https://alexa.design/enabledisplay 
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
        "milliseconds": timeSpanMS, 
        "seconds": timeSpanMS / 1000 
        //"minutes": timeSpanMS / (1000 * 60), 
        //"hours": timeSpanMS / (1000 * 60 * 60), 
        //"days": timeSpanMS / (1000 * 60 * 60 * 24) 
    }; 
    return span; 
} 
 
const InitMemoryAttributesRequestInterceptor = { 
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
 
const HistoryRequestInterceptor = { 
    process(handlerInput) { 
        const thisRequest = handlerInput.requestEnvelope.request; 
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
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
        if(history.length > MAX_HISTORY_SIZE - 1) { 
            history.shift(); 
        } 
        history.push(IntentRequest); 
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
    } 
};

const RecordSpeechOutputResponseInterceptor = { 
    process(handlerInput, response) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        let lastSpeechOutput = { 
            "outputSpeech":response.outputSpeech ? response.outputSpeech.ssml : '<Output handled automatically via dialog delegation>', 
            "reprompt":response.reprompt ? response.reprompt.outputSpeech.ssml : '<Output handled automatically via dialog delegation>', 
        }; 
        sessionAttributes['lastSpeechOutput'] = lastSpeechOutput; 
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
    } 
}; 
 
/*const PersistenceRequestInterceptor = { 
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
 
const PersistenceResponseInterceptor = { 
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

const TimestampResponseInterceptor = {
    process(handlerInput, responseOutput) { 
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        sessionAttributes['requestTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).toISOString();
        sessionAttributes['responseTimestamp'] = new Date().toISOString();
        sessionAttributes['deltaTime'] = timeDelta(handlerInput.requestEnvelope.request.timestamp, sessionAttributes['responseTimestamp']);
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    } 
};

const DialogStateResponseInterceptor = {
    process(handlerInput, responseOutput) { 
        const request = handlerInput.requestEnvelope.request;
        if(request.dialogState) {
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
            sessionAttributes['dialogState'] = request.dialogState;
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

const LocalizationRequestInterceptor = {
    process(handlerInput) {
      const localizationClient = i18n.use(sprintf).init({
        lng: handlerInput.requestEnvelope.request.locale,
        fallbackLng: 'en',
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        resources: languageStrings,
        returnObjects: true
      });
  
      const attributes = handlerInput.attributesManager.getRequestAttributes();
      attributes.t = function (...args) {
        return localizationClient.t(...args);
      }
    }
  }
  
const LocalizationRequestInterceptorWithArraySupport = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            resources: languageStrings
        });
  
        localizationClient.localize = function () {
            const args = arguments;
            let values = [];
  
            for (var i = 1; i < args.length; i++) {
                values.push(args[i]);
            }
            const value = i18n.t(args[0], {
                returnObjects: true,
                postProcess: 'sprintf',
                sprintf: values
            });
  
            if (Array.isArray(value)) {
                return value[Math.floor(Math.random() * value.length)];
            } else {
                return value;
            }
        }
  
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) { // pass on arguments to the localizationClient
            return localizationClient.localize(...args);
        };
    },
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
        FallbackIntentHandler,
        DialogueIntentHandler,
        ReflectorIntentHandler,
        SessionEndedHandler,
        CatchAllIntentHandler
    )
    .addErrorHandlers(GenericErrorHandler)
    .addRequestInterceptors(InitMemoryAttributesRequestInterceptor)
    .addRequestInterceptors(HistoryRequestInterceptor)
    .addRequestInterceptors(LocaleRequestInterceptor)
    .addRequestInterceptors(LocalizationRequestInterceptor)
    .addRequestInterceptors(LoggingRequestInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .addResponseInterceptors(RecordSpeechOutputResponseInterceptor)
    .addResponseInterceptors(TimestampResponseInterceptor)
    .addResponseInterceptors(DialogStateResponseInterceptor)
    // .addRequestInterceptors(PersistenceRequestInterceptor)
    // .addResponseInterceptors(PersistenceResponseInterceptor)
    // .withTableName("reflectorTable")
    // .withAutoCreateTable(true)
    .lambda();