describe("Add Repository Form Modal", function() {
  beforeEach(function() {
    cy
      .configureCluster({
        mesos: "1-task-healthy",
        universePackages: true
      })
      .visitUrl({ url: "/settings/repositories" })
      .get(".page-header-actions button")
      .click();
  });

  it("displays modal for adding repository", function() {
    cy.get(".modal h2").should("contain", "添加存储库");
  });

  it("displays three fields", function() {
    cy.get(".modal input").should("to.have.length", 3);
  });

  it("should display error if both fields aren't filled out", function() {
    cy
      .get(".modal .modal-footer .button.button-success")
      .contains("Add")
      .click();

    cy
      .get(".modal .form-control-feedback")
      .eq(0)
      .should("contain", "字段不能为空。");

    cy
      .get(".modal .form-control-feedback")
      .eq(1)
      .should("contain", "必须是包含http:// 或者 https:// 的合法网址。");
  });

  it("should display error if not a valid url", function() {
    cy
      .get(".modal .modal-footer .button.button-success")
      .contains("Add")
      .click();

    cy
      .get(".modal .form-control-feedback")
      .should("contain", "必须是包含http:// 或者 https:// 的合法网址。");
  });

  it("closes modal after add is successful", function() {
    cy
      .get(".modal input")
      .eq(0)
      .type("Here we go!")
      .get(".modal input")
      .eq(1)
      .type("http://there-is-no-stopping.us")
      .get(".modal input")
      .eq(2)
      .type("0")
      .get(".modal .modal-footer .button.button-success")
      .contains("Add")
      .click();

    cy.get(".modal").should("exist");

    // Clean up
    cy.clusterCleanup(function() {
      cy
        .get(".page-body-content")
        .contains("tr", "Here we go!")
        .find(".button.button-link.button-danger")
        .invoke("show")
        .click({ force: true });
      cy
        .get(".modal .modal-footer .button.button-danger")
        .contains("删除存储库")
        .click();
    });
  });

  it("displays error in modal after add causes an error", function() {
    // We need to add a fixture for this test to pass.
    var url = "http://there-is-no-stopping.us";
    cy
      .route({
        method: "POST",
        url: /repository\/add/,
        status: 409,
        response: {
          message: "Conflict with " + url
        }
      })
      .get(".modal input")
      .eq(0)
      .type("Here we go!")
      .get(".modal input")
      .eq(1)
      .type(url)
      .get(".modal input")
      .eq(2)
      .type("0");
    cy
      .get(".modal .modal-footer .button.button-success")
      .contains("Add")
      .click();

    cy.get(".modal h4.text-danger").should("contain", url);
  });

  // TODO: Turn into unit test
  it("displays generic error in modal if no message is provided", function() {
    cy
      .route({
        method: "POST",
        url: /repository\/add/,
        status: 400,
        response: {}
      })
      .get(".modal input")
      .eq(0)
      .type("Here we go!");
    cy
      .get(".modal input")
      .eq(1)
      .type("http://there-is-no-stopping.us")
      .get(".modal input")
      .eq(2)
      .type("0");
    cy
      .get(".modal .modal-footer .button.button-success")
      .contains("Add")
      .click();

    cy.get(".modal h4.text-danger").should("contain", "出现错误");
  });
});
