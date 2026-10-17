import { Page, Locator, expect } from '@playwright/test';

// Reto 2 (Tarea 06): Page Object del menú hamburguesa.
export class MenuPage {
  readonly page: Page;
  readonly menuButton: Locator;
  readonly closeButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeButton = page.locator('#react-burger-cross-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async open() {
    await this.menuButton.click();
    await expect(this.logoutLink).toBeVisible();
  }

  async logout() {
    await this.open();
    await this.logoutLink.click();
    await expect(this.page).toHaveURL('https://www.saucedemo.com/');
  }
}
