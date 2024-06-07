describe("/friends manipulation - private profile friend", () => {
    const email02 = "test02@example.com";
    const password02 = "password123D!";

    const email03 = "test03@example.com";
    const password03 = "password123D!";

    beforeEach(() => {
        cy.login();
        cy.visit("/friends");
    });

    it("Private profile: Send friend request, accept, verify relations is established, and remove relationship", () => {
        cy.dataCy("fri-search").find("input").check();
        cy.dataCy("fri-textfield").type("90241aa1-9820-4499-bc05-1daff7c8043e");
        cy.contains("Add By User ID").click();
        cy.contains("Sent friend request successfully.");

        cy.logout();
        cy.login(email02, password02);
        cy.visit("/friends");

        cy.dataCy("fri-pending").find("input").check();
        cy.contains("Test01 Account01");

        cy.dataCy("fri-accept").click();
        cy.contains("Accepted pending friend request.");

        cy.logout();
        cy.login();

        cy.visit("/friends");
        cy.contains("Test02 Account02");

        cy.dataCy("fri-remove").click();
        cy.contains("Removed friend successfully.");
    });

    it("Public profile: Send friend request and remove relationship", () => {
        cy.dataCy("fri-search").find("input").check();
        cy.contains("Test03 Account03").parent().find("button").click();
        cy.contains("Sent friend request successfully.");

        cy.visit("/friends");

        cy.dataCy("fri-pending").find("input").check();
        cy.contains("Test03 Account03").parent().find("button").click();
        cy.contains("Removed friend successfully.");

        cy.logout();
        cy.login(email03, password03);
        cy.visit("/friends");
        cy.contains("Test01 Account01").should("not.exist");
    });
});
