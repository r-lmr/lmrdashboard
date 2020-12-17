/// <reference types="cypress" />

describe('Local server', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });
});

export {};
