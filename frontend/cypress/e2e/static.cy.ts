describe("Static pages check", () => {
    it("Home page", () => {
        cy.visit("/");

        cy.get('a[href="https://www.linkedin.com/in/nam-do-630bb2173/"]');

        cy.get('a[href="https://github.com/namdo1225"]');

        cy.get('a[href="https://github.com/namdo1225/chat-app"]');

        cy.get('a[href="https://namdo1225.github.io"]');

        cy.get('a[href="https://namdo1225.github.io/project.html"]');
    });

    it("Privacy page", () => {
        cy.visit("/privacy");
    });

    it("About Us page", () => {
        cy.visit("/about");
    });
});