describe("User manipulation", () => {
    const email = "testemail@example.com";
    const password = "123943AbC!Hello?";

    it("Registering to the app", () => {
        cy.visit("/register");
        cy.dataCy("reg-firstName").type("FirstTest");
        cy.dataCy("reg-lastName").type("LastTest");
        cy.dataCy("reg-email").type(email);
        cy.dataCy("reg-password").type(password);
        cy.dataCy("reg-passwordConfirm").type(password);

        cy.get("form").submit();
        cy.dataCy("reg-form").should("not.exist");

        cy.login(email, password);

        cy.contains("FirstTest LastTest");
    });

    it("Editing a user", () => {
        cy.login(email, password);
        cy.visit("/profile");

        cy.dataCy("prof-firstName").type('{selectall}{backspace}');
        cy.dataCy("prof-firstName").type("Unlimited");

        cy.dataCy("prof-lastName").type('{selectall}{backspace}');
        cy.dataCy("prof-lastName").type("Ammo");

        cy.dataCy("prof-submit").click();
        cy.contains("Your profile updated successfully.");
    });

    it("Deleting a user", () => {
        cy.login(email, password);
        cy.visit("/account");

        cy.contains("Delete Account").click();

        cy.dataCy("del-email").type(email);
        cy.dataCy("del-email").trigger("change");
        cy.dataCy("del-button").click();
        cy.dataCy("del-button").should("not.exist");

        cy.contains("Login");
    });
});
