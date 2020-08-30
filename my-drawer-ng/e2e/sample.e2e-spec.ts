import { createDriver, nsCapabilities, SearchOptions, startServer, stopServer } from "nativescript-dev-appium";

console.log("emulator runType: " + nsCapabilities.runType);

describe("sample scenario", async () => {
    await new Promise<void>((resolve) => setTimeout(resolve, 10000));

    it("should find an element by text", async () => {
        const driver = await createDriver();
        const btnTap = await driver.findElementByAutomationText("TAP");
        await btnTap.click();

        const message = " taps left";
        const lblMessage = await driver.findElementByText(message, SearchOptions.contains);
        expect(await lblMessage.text()).toContain("41");
        // Image verification
        // const screen = await driver.compareScreen("hello-world-41");
        // assert.isTrue(screen);
        // expect(screen).toBeTruthy();
    });

    it("should find an element by type", async () => {
        const driver = await createDriver();
        const btnTap = await driver.findElementByClassName(driver.locators.button);
        await btnTap.click();

        const message = " taps left";
        const lblMessage = await driver.findElementByText(message, SearchOptions.contains);
        expect(await lblMessage.text()).toContain("40");
    });
});