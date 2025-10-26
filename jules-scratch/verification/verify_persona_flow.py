from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Register a new user
    page.goto("http://localhost:3000/register")
    page.get_by_label("Email").fill("testuser@example.com")
    page.get_by_label("Password").fill("password123")
    page.get_by_label("Confirm Password").fill("password123")
    page.get_by_role("button", name="Register").click()
    expect(page).to_have_url("http://localhost:3000/")

    # Give the server a moment to catch up
    time.sleep(2)

    # Create a new persona
    page.goto("http://localhost:3000/personas")
    page.get_by_role("link", name="Create Persona").click()
    expect(page).to_have_url("http://localhost:3000/personas/new")
    page.get_by_label("Persona Name").fill("Test Persona")
    page.get_by_label("Description").fill("A test persona description.")
    page.get_by_role("button", name="Create Persona").click()
    expect(page).to_have_url("http://localhost:3000/personas")
    expect(page.get_by_text("Test Persona")).to_be_visible()

    # Create a new character with the persona
    page.goto("http://localhost:3000/characters")
    page.get_by_role("link", name="Create Character").click()
    expect(page).to_have_url("http://localhost:3000/characters/new")
    page.get_by_label("Character Name").fill("Persona Character")
    page.get_by_label("Link Persona").select_option(label="Test Persona")
    page.get_by_role("button", name="Next").click()
    page.get_by_role("button", name="Next").click()
    page.get_by_placeholder("Once upon a time...").fill("A character linked to a persona.")
    page.get_by_role("button", name="Next").click()
    page.get_by_role("button", name="Create Character").click()
    expect(page).to_have_url("http://localhost:3000/characters")
    expect(page.get_by_text("Persona Character")).to_be_visible()

    page.screenshot(path="jules-scratch/verification/persona_flow_verification.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
