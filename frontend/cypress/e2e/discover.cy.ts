describe("/discover manipulation", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/discover");
    });

    it("Finding a public group", () => {
        cy.contains("TestChat01");
    });

    it("Joining a public group", () => {
        cy.contains("TestChat01").parent().find("button").click();
        cy.contains("Joined chat successfully.");
    });

    it("Verifying group is joined", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01");
    });

    it("Leave joined chat group", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01").parent().parent().find("[data-cy=scroll-leave]").click();
        cy.contains("Leave Chat").click();
        cy.contains("You left the chat successfully.");
    });
});
