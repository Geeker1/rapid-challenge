import { chromium, devices, type ElementHandle } from 'playwright';
import { bulkInsertTeeTime } from '../db/client';


const WEBSITE_URL = 'https://commonground-golf-course.book.teeitup.com/';

function convertTo24Hour(time: string): string {
    const [match, hours, minutes, period] = time.match(/(\d+):(\d+) (AM|PM)/i) || [];

    if (!match) throw Error("Invalid format found!!"); // Invalid format

    let hour = parseInt(hours);
    if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

    return `${hour.toString().padStart(2, '0')}:${minutes}`;
}

async function getMaxMinPlayers(element: ElementHandle<SVGElement | HTMLElement>) {

    const players = await element.$eval('xpath=.//p[@data-testid="teetimes-tile-available-players"]', el => el.textContent?.trim());

    if(!players) throw Error("Unable to fetch min-max players");

    let max_players: number;
    let min_players: number;

    if (players.length == 1){
        max_players = parseInt(players);
        min_players = parseInt(players);
    } else {
        let str = players;
        let numbers = str.split(" - ").map(Number);
        min_players = numbers[0];
        max_players = numbers[1];
    }

    return {
        max_players,
        min_players
    }
}

const mergeTimeWithDate = (timeString: string) => {
    // Get the current date
    const now = new Date();

    // Extract hours and minutes from the provided time
    const [hours, minutes] = timeString.split(":").map(Number);

    // Set the extracted time on the current date
    now.setHours(hours, minutes, 0, 0);

    // Convert to ISO string
    return now.toISOString();
};

function extractHoleData(verbiage: string | undefined): number {
    if(verbiage == "9") return 9;
    if (verbiage == "18") return 18;
    throw Error("Invalid");
}

async function extractPriceData(element: ElementHandle<SVGElement | HTMLElement>){
    const prices = await element.$eval("xpath=.//p[contains(text(), '$')]", 
        el => el.textContent?.trim()
    );

    if (!prices) throw Error("Invalid price");

    return parseInt(prices.replace("$", ""), 10);
}

async function processData(element: ElementHandle<SVGElement | HTMLElement>){
    const timestamp = await element.$eval(
        'xpath=.//p[@data-testid="teetimes-tile-time"]',  // Change this XPath to your target element
        el => el.textContent?.trim()
    )
    
    if(!timestamp) throw Error("No Timestamp for this data");

    const time_24 = convertTo24Hour(timestamp);

    const verbiage = await element.$eval(
        'xpath=.//p[@data-testid="teetimes-tile-hole-verbiage"]',  // Change this XPath to your target element
        el => el.textContent?.trim()
    )

    const holes = extractHoleData(verbiage);

    const price = await extractPriceData(element);

    const { min_players, max_players } = await getMaxMinPlayers(element);

    return {
        id: mergeTimeWithDate(time_24),
        time: time_24,
        min_players,
        max_players,
        holes,
        price
    }
}

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['Desktop Chrome']);
    const page = await context.newPage();

    await page.goto(WEBSITE_URL);

    // Wait for the parent div to appear
    await page.waitForSelector('.MuiGrid-root.css-ibcypl');

    const elements = await page.$$('//div[contains(@class, "MuiGrid-root MuiGrid-container css-1d3bbye")]');

    const dataArray = []

    for (const element of elements) {
        try {
            const data = await processData(element);
            dataArray.push(data)
        } catch (error) {
            continue
        }

    }

    await bulkInsertTeeTime(dataArray);    

    console.log("Data Scraped Successfully!!!")
    
    // Teardown
    await context.close();
    await browser.close();
  (globalThis as any).process?.exit(0);
})();

