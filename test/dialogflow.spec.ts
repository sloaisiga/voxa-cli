/*
 * Copyright (c) 2019 Rain Agency <contact@rain.agency>
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

import { expect } from "chai";
import fs = require("fs-extra");
import _ from "lodash";
import path from "path";
import { BUILT_IN_INTENTS_LIST } from "../src/DialogflowDefault";
import { LOCALES } from "../src/DialogflowSchema";
import * as builtIntents from "../src/languages/index";
import { configurations } from "./mocha.spec";

configurations.forEach(interactionFile => {
  if (
    !_.includes(interactionFile.platforms, "dialogflow") &&
    !interactionFile.dialogflowSpreadsheets
  ) {
    return;
  }

  const interactionFileNameSplitted: string[] = interactionFile.interactionFileName.split("/");
  const interactionFileName: any = interactionFileNameSplitted.pop();
  const localesLowerCase: any = LOCALES.map(local => local.toLocaleLowerCase());

  let localeInFile: any = localesLowerCase
    .map((locale: any) => {
      const result: any = interactionFileName.search(locale);
      if (result !== -1) {
        return locale.slice(0, -3);
      }
    })
    .filter((l: any) => l);

  if (_.isEmpty(localeInFile)) {
    localeInFile.push("en-us".slice(0, -3));
  }
  localeInFile = _.head(localeInFile);

  describe(`${interactionFile.name} Dialogflow`, () => {
    let agent: any;

    before(async function before() {
      if (interactionFile.skip) {
        return this.skip();
      }

      const agentPath = path.join(
        path.dirname(interactionFile.interactionFileName),
        interactionFile.speechPath,
        "dialogflow/production/agent.json"
      );
      agent = await JSON.parse((await fs.readFile(agentPath)).toString());
    });

    describe("GOOGLE_ASSISTANT_WELCOME", () => {
      let intent: any;

      before(async () => {
        const intentPath = path.join(
          path.dirname(interactionFile.interactionFileName),
          interactionFile.speechPath,
          "dialogflow/production/intents/GOOGLE_ASSISTANT_WELCOME.json"
        );

        intent = JSON.parse((await fs.readFile(intentPath)).toString());
      });

      it("should generate a GOOGLE_ASSISTANT_WELCOME intent", () => {
        expect(intent.name).to.equal("GOOGLE_ASSISTANT_WELCOME");
      });

      it("should set the GOOGLE_ASSISTANT_WELCOME intent as a startIntent", () => {
        expect(agent.googleAssistant.startIntents[0].intentId).to.equal(intent.id);
      });

      it("should set webhookForSlotFilling to false", () => {
        expect(intent.webhookForSlotFilling).to.be.false;
      });
    });

    describe("NumberIntent", () => {
      let intent: any;
      let intentUtterance: any;
      before(async () => {
        const intentPath = path.join(
          path.dirname(interactionFile.interactionFileName),
          interactionFile.speechPath,
          "dialogflow/production/intents/NumberIntent.json"
        );
        const utterancesPath = path.join(
          path.dirname(interactionFile.interactionFileName),
          interactionFile.speechPath,
          `dialogflow/production/intents/NumberIntent_usersays_${localeInFile}.json`
        );
        intent = JSON.parse((await fs.readFile(intentPath)).toString());
        intentUtterance = JSON.parse((await fs.readFile(utterancesPath)).toString());
      });

      it("should set slotRequired for the first slot to be false", () => {
        expect(intent.responses[0].parameters).to.have.lengthOf(1);
        expect(intent.responses[0].parameters[0].required).to.be.false;
      });

      it("should set webhookForSlotFilling to true", () => {
        expect(intent.webhookForSlotFilling).to.be.true;
      });

      it("should have @sys slot for numbers", () => {
        intentUtterance.forEach((utterance: any) => {
          const numberMetaPhrase = utterance.data.find((item: any) => item.meta === "@sys.number");
          expect(numberMetaPhrase).to.be.ok;

          expect(_.pick(numberMetaPhrase, ["meta", "alias", "text"])).to.be.eql({
            meta: "@sys.number",
            alias: "number",
            text: "{number}"
          });
        });
      });
    });

    describe("JokeIntent", () => {
      let intent: any;
      before(async () => {
        const intentPath = path.join(
          path.dirname(interactionFile.interactionFileName),
          interactionFile.speechPath,
          "dialogflow/production/intents/JokeIntent.json"
        );
        intent = JSON.parse((await fs.readFile(intentPath)).toString());
      });
      it("should set webhookUsed to false", () => {
        expect(intent.webhookUsed).to.be.false;
      });

      it("should create a messages key with an array of the responses", () => {
        expect(intent.responses[0].messages).to.have.lengthOf(1);
        expect(intent.responses[0].messages[0].speech).to.have.lengthOf(3);
      });
    });

    describe("DateIntent", () => {
      let intent: any;

      before(async () => {
        const intentPath = path.join(
          path.dirname(interactionFile.interactionFileName),
          interactionFile.speechPath,
          "dialogflow/production/intents/DateIntent.json"
        );
        intent = JSON.parse((await fs.readFile(intentPath)).toString());
      });

      it("should set slotRequired for the first slot to be true", () => {
        expect(intent.responses[0].parameters).to.have.lengthOf(1);
        expect(intent.responses[0].parameters[0].required).to.be.true;
      });
    });

    describe(`Built In Intents ${interactionFileName}`, () => {
      let intentList: string[];
      let folderIntentsPath: string;
      before(async () => {
        folderIntentsPath = path.join(
          path.dirname(interactionFile.interactionFileName),
          interactionFile.speechPath,
          "dialogflow/production/intents"
        );

        const intentFileName = BUILT_IN_INTENTS_LIST.map(i =>
          i.concat(`_usersays_${localeInFile}.json`)
        );
        const filesName: string[] = _.flatMapDeep(
          fs.readdirSync(folderIntentsPath).map(f => {
            return intentFileName.filter(i => f === i);
          })
        );

        intentList = _.chain(
          filesName.map(file => intentFileName.filter(i => file === i)).filter(e => e)
        )
          .flattenDeep()
          .uniq()
          .value();
      });

      it("should validate built in intent samples", () => {
        intentList.forEach(async i => {
          const intentFile = JSON.parse(
            (await fs.readFile(`${folderIntentsPath}/${i}`)).toString()
          );
          i = i.replace(`_usersays_${localeInFile}.json`, "");
          const intentsPerLanguage = builtIntents.language
            .map(el => el[localeInFile])
            .filter(e => e)[0];
          const sampleList: string[] = _.uniq(intentsPerLanguage[i]);
          const samplesInFile: string[] = intentFile.map(
            (int: { data: [{ text: any }] }) => int.data[0].text
          );

          const customBuiltInIntents: string[] = ["StopIntent"];
          const result: boolean = _.isEqual(sampleList, samplesInFile);

          if (result) {
            expect(result).to.be.true;
          }

          if (!result) {
            const isCustom: boolean = customBuiltInIntents.includes(i);
            expect(isCustom).to.be.true;
          }
        });
      });
    });
  });
});
