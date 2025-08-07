import 'dotenv/config'; // 이 줄을 맨 위에 추가
import { AppServer, AppSession, ViewType } from '@mentra/sdk';
import fs from 'fs';
import path from 'path';


const PACKAGE_NAME = process.env.PACKAGE_NAME ?? (() => { throw new Error('PACKAGE_NAME is not set in .env file'); })();
const MENTRAOS_API_KEY = process.env.MENTRAOS_API_KEY ?? (() => { throw new Error('MENTRAOS_API_KEY is not set in .env file'); })();
const PORT = parseInt(process.env.PORT || '3002');

class ExampleMentraOSApp extends AppServer {

  constructor() {
    super({
      packageName: PACKAGE_NAME,
      apiKey: MENTRAOS_API_KEY,
      port: PORT,
    });
  }

  protected async onSession(session: AppSession, sessionId: string, userId: string): Promise<void> {
    console.log('onSession called', sessionId, userId);

    const firstLine = "Accessing Members.";
    const secondLine = "Whose profile would you like??";
    const thirdLine = "Just say the name";

    // members.json 불러오기
    const membersPath = path.join(__dirname, '../data/members.json');
    let members: Record<string, string> = {};
    try {
      members = JSON.parse(fs.readFileSync(membersPath, 'utf-8'));
    } catch (e) {
      console.error('Failed to load members.json:', e);
    }

    // 첫 줄만 먼저 표시
    session.layouts.showTextWall(firstLine);

    setTimeout(() => {
      session.layouts.showTextWall(`${firstLine}\n${secondLine}`);
    }, 1150);

    setTimeout(() => {
      let showColon = true;
      const baseText = `${firstLine}\n${secondLine}\n${thirdLine}`;
      session.layouts.showTextWall(baseText + " :");
      const blinkInterval = setInterval(() => {
        showColon = !showColon;
        session.layouts.showTextWall(baseText + (showColon ? " :" : "  "));
      }, 500);

      let handled = false;
      const transcriptionHandler = (data: any) => {
        if (handled) return;
        if (data.isFinal) {
          handled = true;
          clearInterval(blinkInterval); // 반드시 깜빡임 멈추기!
          const name = data.text.trim();
          console.log('음성 인식 결과:', name);
          const foundKey = Object.keys(members).find(
            k => name.replace(/\s/g, '').includes(k.replace(/\s/g, '')) ||
                 k.replace(/\s/g, '').includes(name.replace(/\s/g, ''))
          );
          if (foundKey) {
            session.layouts.showTextWall(members[foundKey], {
              view: ViewType.MAIN
            });
          } else {
            session.layouts.showTextWall(`No profile found for "${name}"`, {
              view: ViewType.MAIN
            });
          }
        }
      };
      session.events.onTranscription(transcriptionHandler);
    }, 2300);

    session.events.onTranscription((data) => {
      console.log('Transcription event fired:', data);
    });

    session.events.onGlassesBattery((data) => {
      console.log('Glasses battery:', data);
    });
  }
}

// Start the server
// DEV CONSOLE URL: https://console.mentra.glass/
// Get your webhook URL from ngrok (or whatever public URL you have)
const app = new ExampleMentraOSApp();

app.start().catch(console.error);