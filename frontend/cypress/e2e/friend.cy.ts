describe("/friends manipulation - private profile friend", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/friends");
    });

    it("Send friend request", () => {
        cy.dataCy("fri-search").find("input").check();
    });

    /*it("Log out and accept friend request", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01");
    });

    it("Verify friend relationship is established", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01").parent().parent().find("[data-cy=scroll-leave]").click();
        cy.contains("Leave Chat").click();
        cy.contains("You left the chat successfully.");
    });

    it("Remove friend relationship", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01").parent().parent().find("[data-cy=scroll-leave]").click();
        cy.contains("Leave Chat").click();
        cy.contains("You left the chat successfully.");
    });*/
});


/*describe("/friends manipulation - public profile friend", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/friends");
    });

    it("Verifying potential friend exists", () => {
        cy.contains("TestChat01");
    });

    it("Send friend request", () => {
        cy.contains("TestChat01").parent().find("button").click();
        cy.contains("Joined chat successfully.");
    });

    it("Log out and accept friend request", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01");
    });

    it("Verify friend relationship is established", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01").parent().parent().find("[data-cy=scroll-leave]").click();
        cy.contains("Leave Chat").click();
        cy.contains("You left the chat successfully.");
    });

    it("Remove friend relationship", () => {
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("TestChat01").parent().parent().find("[data-cy=scroll-leave]").click();
        cy.contains("Leave Chat").click();
        cy.contains("You left the chat successfully.");
    });
});*/