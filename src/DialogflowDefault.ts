/*
 * Copyright (c) 2018 Rain Agency <contact@rain.agency>
 * Author: Rain Agency <contact@rain.agency>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
export const AGENT = {
  description: "description",
  activeAssistantAgents: [],
  disableInteractionLogs: false,
  googleAssistant: {
    googleAssistantCompatible: true,
    project: "project",
    welcomeIntentSignInRequired: false,
    systemIntents: [],
    oAuthLinking: {
      required: false,
      grantType: "AUTH_CODE_GRANT"
    },
    voiceType: "MALE_1",
    capabilities: [],
    protocolVersion: "V2",
    autoPreviewEnabled: true,
    isDeviceAgent: false
  },
  defaultTimezone: "America/New_York",
  webhook: {
    url: "webhook.url",
    headers: {},
    available: true,
    useForDomains: true,
    cloudFunctionsEnabled: false,
    cloudFunctionsInitialized: false
  },
  isPrivate: true,
  customClassifierMode: "use.after",
  mlMinConfidence: 0.2,
  supportedLanguages: [],
  onePlatformApiVersion: "v2beta1"
};

export const BUILT_IN_INTENTS_LIST: string[] = [
  "HelpIntent",
  "StopIntent",
  "CancelIntent",
  "YesIntent",
  "NoIntent",
  "PauseIntent",
  "ResumeIntent",
  "RepeatIntent",
  "StartOverIntent",
  "PreviousIntent",
  "NextIntent",
  "LoopOffIntent",
  "LoopOnIntent",
  "ShuffleOffIntent",
  "ShuffleOnIntent"
];
