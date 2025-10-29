from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Register a new user
    page.goto("http://localhost:3000/register")
    expect(page.get_by_role("heading", name="Register")).to_be_visible()
    page.get_by_placeholder("Email").fill("test@example.com")
    page.get_by_placeholder("Username").fill("testuser")
    page.locator('input[placeholder="Password"]').first.fill("password123")
    page.get_by_placeholder("Confirm Password").fill("password123")
    page.get_by_role("button", name="Register").click()

    # Log in
    expect(page.get_by_role("heading", name="Login")).to_be_visible()
    page.get_by_placeholder("Username or Email").fill("testuser")
    page.get_by_placeholder("Password").fill("password123")
    page.get_by_role("button", name="Login").click()

    # Navigate to dashboard
    expect(page.get_by_role("heading", name="Dashboard")).to_be_visible()

    # Navigate to persona management
    page.goto("http://localhost:3000/personas")
    expect(page.get_by_role("heading", name="Persona Management")).to_be_visible()

    # Navigate to world view
    page.goto("http://localhost:3000/world")
    expect(page.get_by_role("heading", name="World View")).to_be_visible()

    # Navigate to chat
    page.goto("http://localhost:3000/chat")
    expect(page.get_by_role("button", name="Send")).to_be_visible()


    page.screenshot(path="jules-scratch/verification/verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
