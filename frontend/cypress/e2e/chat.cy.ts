describe("/chats manipulation", () => {
    const email03 = "test03@example.com";
    const password03 = "password123D!";
    const email04 = "test04@example.com";
    const password04 = "password123D!";
    const chat = "TChat03";
    const message = "Hello My World!";

    beforeEach(() => {
        cy.login(email03, password03);
        cy.visit("/chats");
    });

    it("Create a chat, add member, remove member, re-add member, send msg, see msg on all side, and delete chat", () => {
        // creates chat and add member Test04 Account04
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.contains("Create a chat").click();

        cy.dataCy("chat-create-name").type(chat);
        cy.dataCy("chat-create-add-fri").click();
        cy.dataCy("chat-create-submit").click();
        cy.contains("Chat created successfully.");

        cy.dataCy("scroll-select").click();
        cy.contains("Test04 Account04");

        // removes member Test04 Account04
        cy.dataCy("chat-sidebar").click();
        cy.dataCy("scroll-leave").click();

        cy.dataCy("chat-edit-fri-remove").click();
        cy.dataCy("chat-edit-submit").click();
        cy.contains("Chat edited successfully.");

        cy.reload();
        cy.contains("Open sidebar").click();
        cy.dataCy("scroll-select").click();
        cy.contains("Test04 Account04").should("not.exist");

        // re-adds Test04 Account04
        cy.dataCy("chat-sidebar").click();
        cy.dataCy("scroll-leave").click();

        cy.dataCy("chat-edit-fri-add").click();
        cy.dataCy("chat-edit-submit").click();
        cy.contains("Chat edited successfully.");

        cy.reload();
        cy.contains("Open sidebar").click();
        cy.dataCy("scroll-select").click();
        cy.contains("Test04 Account04");

        // Sends message
        cy.dataCy("chatting-textfield").type(message);
        cy.dataCy("chatting-submit").click();
        cy.contains(message);

        // See message on recipient's side:
        cy.logout();
        cy.login(email04, password04);
        cy.visit("/chats");
        cy.contains("Open sidebar").click();
        cy.dataCy("scroll-select").click();
        cy.contains("Test03 Account03");
        cy.contains(message);

        // Deletes chat
        cy.logout();
        cy.login(email03, password03);
        cy.visit("/chats");

        cy.dataCy("chat-sidebar").click();
        cy.dataCy("scroll-leave").click();
        cy.dataCy("chat-edit-fri-del").click();

        cy.contains(chat).should("not.exist");
    });
});
