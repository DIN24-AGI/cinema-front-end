describe("Browse Movies Feature", () => {
  it("allows a user to view the movie list", () => {
    cy.visit("http://localhost:5173/");

    cy.contains("Movies").click();
    cy.url().should("include", "/movies");

    cy.contains(/loading/i);

    cy.get("[data-testid='movie-card']").should("have.length.greaterThan", 0);
  });
});
