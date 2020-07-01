import "expect-puppeteer";

describe("Google", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:8083/signup");
  });

  it("Fill out Signup", async () => {
    await expect(page).toFillForm('form[name="signup_form"]', {
      username: "saurabjdc1@gmail.com",
      password: "password",
      confirm_password: "password"
    });
  });
  it("Click Login", async () => {
    await expect(page).toClick("button", { text: "Register" });
    await page.waitForNavigation();
  });

  it("Fill out login", async () => {
    await expect(page).toFillForm('form[name="login_form"]', {
      login: "saurabjdc@gmail.com",
      password: "password"
    });
  });

  it("Click Login", async () => {
    await expect(page).toClick("button", { text: "Login" });
    await page.waitForNavigation();
  });

  it("Click Sample Files Tab", async () => {
    //await expect(page).toClick("a", { text: "Samples" });
    page.click("#sample_tab");
    await page.waitForNavigation();
    //await expect(true).toBe(true)
  });

  it("Click Sample File", async () => {
    await expect(page).toClick("#sample_button", { text: "" });
    //await page.click('#sample')
    await page.waitForNavigation();
  });

  it("Click Upload Again", async () => {
    await expect(page).toClick("button", { text: "Upload" });
  });

  it("Click Another Sample ", async () => {
    await expect(page).toClick("#sample_button", { text: "" });
    //await page.click('#sample')
    await page.waitForNavigation();
  });

  it("Logout", async () => {
    await expect(page).toClick("button", { text: "Logout" });
    //await page.click('#sample')
    //await page.waitForNavigation();
  });
});
