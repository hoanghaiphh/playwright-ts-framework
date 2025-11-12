import { test as base } from '@playwright/test';
import { getPage } from '@base-test';
import { Header } from '@nopcommerce-user/components/Header';
import { HomePage } from '@nopcommerce-user/pages/HomePage';
import { LoginPage } from '@nopcommerce-user/pages/LoginPage';
import { RegisterPage } from '@nopcommerce-user/pages/RegisterPage';
import { CustomerInfoPage } from '@nopcommerce-user/pages/CustomerInfoPage';
import { CustomersListPage } from '@nopcommerce-admin/pages/CustomersListPage';
import { CustomerDetailsPage } from '@nopcommerce-admin/pages/CustomerDetailsPage';
import { AddCustomerPage } from '@nopcommerce-admin/pages/AddCustomerPage';

export type CommonFixtures = {
    header: Header,
    homePage: HomePage,
    loginPage: LoginPage,
    registerPage: RegisterPage,
    customerInfoPage: CustomerInfoPage,
    customersListPage: CustomersListPage,
    customerDetailsPage: CustomerDetailsPage,
    addCustomerPage: AddCustomerPage,
};

export const test = base.extend<CommonFixtures>({

    header: async ({ }, use) => {
        await use(getPage(Header));
    },

    homePage: async ({ }, use) => {
        await use(getPage(HomePage));
    },

    loginPage: async ({ }, use) => {
        await use(getPage(LoginPage));
    },

    registerPage: async ({ }, use) => {
        await use(getPage(RegisterPage));
    },

    customerInfoPage: async ({ }, use) => {
        await use(getPage(CustomerInfoPage));
    },

    customersListPage: async ({ }, use) => {
        await use(getPage(CustomersListPage));
    },

    customerDetailsPage: async ({ }, use) => {
        await use(getPage(CustomerDetailsPage));
    },

    addCustomerPage: async ({ }, use) => {
        await use(getPage(AddCustomerPage));
    },
});