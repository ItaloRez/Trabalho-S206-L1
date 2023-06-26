describe("Criando cenários de teste para o site saucedemo", () => {
  it("Caso de teste: Tentativa de login", () => {
    cy.login("standard_user", "secret_sauce");

    cy.get(".title").should("contain", "Products");
  });

  it("Caso de teste: Tentativa de login com usuário bloqueado", () => {
    cy.login("locked_out_user", "secret_sauce");

    cy.get('[data-test="error"]').should(
      "contain",
      "Sorry, this user has been locked out."
    );
  });

  it("Caso de teste: Tentativa de login com usuário não cadastrado", () => {
    cy.login("usuario_nao_cadastrado", "senha_nao_cadastrada");

    cy.get('[data-test="error"]').should(
      "contain",
      "Username and password do not match any user in this service"
    );
  });

  it("Caso de teste: Adicionar produto ao carrinho", () => {
    cy.login("standard_user", "secret_sauce");

    adicionarProdutoAoCarrinho("sauce-labs-backpack");

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");
  });

  it("Caso de teste: Remover produto do carrinho", () => {
    cy.login("standard_user", "secret_sauce");

    adicionarProdutoAoCarrinho("sauce-labs-backpack");
    adicionarProdutoAoCarrinho("sauce-labs-bike-light");

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");

    cy.get('[data-test="remove-sauce-labs-backpack"]').click();

    cy.get(".cart_item").should("not.contain", "Sauce Labs Backpack");
  });

  it("Caso de teste: Finalizar compra", () => {
    cy.login("standard_user", "secret_sauce");

    adicionarProdutoAoCarrinho("sauce-labs-backpack");

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");

    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]').type("Teste");

    cy.get('[data-test="lastName"]').type("Teste");

    cy.get('[data-test="postalCode"]').type("00000000");

    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="finish"]').click();

    cy.get(".complete-header").should("contain", "Thank you for your order!");
  });

  it("Caso de teste: Tentativa de finalizar compra sem preencher os campos", () => {
    cy.login("standard_user", "secret_sauce");

    adicionarProdutoAoCarrinho("sauce-labs-backpack");

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");

    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should(
      "contain",
      "Error: First Name is required"
    );
  });

  it("Caso de teste: Tentativa de finalizar compra sem preencher o campo Zip Postal Code", () => {
    cy.login("standard_user", "secret_sauce");

    adicionarProdutoAoCarrinho("sauce-labs-backpack");

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");

    cy.get('[data-test="checkout"]').click();

    cy.get('[data-test="firstName"]').type("Teste");

    cy.get('[data-test="lastName"]').type("Teste");

    cy.get('[data-test="continue"]').click();

    cy.get('[data-test="error"]').should(
      "contain",
      "Error: Postal Code is required"
    );
  });

  it("Caso de teste: Ao voltar para a tela de produtos, os produtos adicionados ao carrinho devem continuar lá", () => {
    cy.login("standard_user", "secret_sauce");

    adicionarProdutoAoCarrinho("sauce-labs-backpack");

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");

    cy.get('[data-test="continue-shopping"]').click();

    cy.get(".shopping_cart_link").click();

    cy.get(".cart_item").should("contain", "Sauce Labs Backpack");
  });
});

function adicionarProdutoAoCarrinho(produto) {
  cy.get(`[data-test="add-to-cart-${produto}"]`).click();
}
