/// <reference types="cypress" />

describe('Local server', () => {
  it('successfully loads', () => {
    cy.visit('/');
  });

  it('source hyperlink points correctly to GitHub', () => {
    cy.visit('/');
    cy.get('.nav-item:nth-child(3) > .nav-link').click();
    cy.url().should('include', '/r-lmr/lmrdashboard')
  });

});

export {};
