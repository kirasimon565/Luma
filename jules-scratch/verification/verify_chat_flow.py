from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in
    page.goto("http://localhost:3000/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_role("button", name="Login").click()
    expect(page).to_have_url("http://localhost:3000/")

    # Create a new character
    page.get_by_role("link", name="Create Character").click()
    expect(page).to_have_url("http://localhost:3000/characters/new")
    page.get_by_label("Character Name").fill("Test Character")
    page.get_by_label("Avatar URL").fill("https://example.com/avatar.png")
    page.get_by_label("Voice Style").fill("A test voice")
    page.get_by_role("button", name="Next").click()
    page.get_by_placeholder("Trait Name").fill("mood")
    page.get_by_placeholder("Trait Value").fill("happy")
    page.get_by_role("button", name="Add").click()
    page.get_by_role("button", name="Next").click()
    page.get_by_placeholder("Once upon a time...").fill("This is a test backstory.")
    page.get_by_role("button", name="Next").click()
    page.get_by_role("button", name="Create Character").click()
    expect(page).to_have_url("http://localhost:3000/characters")
    expect(page.get_by_text("Test Character")).to_be_visible()

    # Chat with the new character
    page.get_by_text("Test Character").click()
    expect(page).to_have_url(lambda url: url.startswith("http://localhost:3000/characters/"))
    page.get_by_role("button", name="Chat with Test Character").click()
    expect(page).to_have_url(lambda url: url.startswith("http://localhost:3000/chat/"))
    page.get_by_placeholder("Message Test Character...").fill("Hello, this is a test.")
    page.get_by_role("button", name="Send").click()

    # Wait for the AI response
    expect(page.locator("div:has-text(\"Hello, this is a test.\")").locator("..").locator("div:has-text(\"placeholder response\")")).to_be_visible(timeout=30000)
    page.screenshot(path="jules-scratch/verification/chat_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
