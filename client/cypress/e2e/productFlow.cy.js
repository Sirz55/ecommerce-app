describe('Product Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow user to add product to cart and complete checkout', () => {
    // Search for a product
    cy.get('[data-testid="search-input"]').type('iPhone');
    cy.get('[data-testid="search-button"]').click();

    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-cart-button"]').click();
    });

    // Navigate to cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should('include', '/cart');

    // Verify cart item
    cy.get('[data-testid="cart-item"]').should('exist');

    // Proceed to checkout
    cy.get('[data-testid="checkout-button"]').click();
    cy.url().should('include', '/checkout');

    // Fill address details
    cy.get('[data-testid="address-form"]').within(() => {
      cy.get('[name="fullName"]').type('John Doe');
      cy.get('[name="mobile"]').type('9876543210');
      cy.get('[name="pincode"]').type('123456');
      cy.get('[name="address"]').type('123 Main St');
      cy.get('[name="city"]').type('New York');
      cy.get('[name="state"]').type('NY');
      cy.get('[name="addressType"]').select('Home');
      cy.get('[data-testid="continue-button"]').click();
    });

    // Fill payment details
    cy.get('[data-testid="payment-form"]').within(() => {
      cy.get('[name="cardNumber"]').type('4111111111111111');
      cy.get('[name="expiry"]').type('12/25');
      cy.get('[name="cvv"]').type('123');
      cy.get('[data-testid="pay-button"]').click();
    });

    // Verify order confirmation
    cy.get('[data-testid="order-confirmation"]').should('exist');
    cy.get('[data-testid="tracking-number"]').should('exist');
  });

  it('should allow user to add product to wishlist', () => {
    // Search for a product
    cy.get('[data-testid="search-input"]').type('iPhone');
    cy.get('[data-testid="search-button"]').click();

    // Add product to wishlist
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('[data-testid="add-to-wishlist-button"]').click();
    });

    // Navigate to wishlist
    cy.get('[data-testid="wishlist-icon"]').click();
    cy.url().should('include', '/wishlist');

    // Verify wishlist item
    cy.get('[data-testid="wishlist-item"]').should('exist');
  });

  it('should allow user to compare products', () => {
    // Search for products
    cy.get('[data-testid="search-input"]').type('iPhone');
    cy.get('[data-testid="search-button"]').click();

    // Add products to compare
    cy.get('[data-testid="product-card"]').each(($el, index) => {
      if (index < 2) {
        cy.wrap($el).within(() => {
          cy.get('[data-testid="compare-button"]').click();
        });
      }
    });

    // Navigate to compare page
    cy.get('[data-testid="compare-button"]').click();
    cy.url().should('include', '/compare');

    // Verify comparison
    cy.get('[data-testid="comparison-grid"]').should('exist');
    cy.get('[data-testid="spec-select"]').should('exist');
  });
});
