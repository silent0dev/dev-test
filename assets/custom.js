class CartRemoveButton extends HTMLElement {
    constructor() {
      super();
  
      this.addEventListener('click', (event) => {
        event.preventDefault();
        this.removeCartItem();        
      });
    }

    removeCartItem() {
        const cartItems = this.closest('cart-items') || this.closest('cart-drawer-items');
        const variantId = this.dataset.id
        const data = {
            updates: {}
        }
        data.updates[variantId] = 0;
        fetch('/cart/update.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            this.closest('.cart-item').remove();
            document.querySelector('.cart-count-bubble span:first-of-type').textContent = data.item_count;
            document.querySelector('.cart-count-bubble span:last-of-type').textContent = `${data.item_count} items`;
            const totalPrice = (data.total_price / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
            })
            document.querySelector('.totals__total-value').textContent = `${totalPrice} USD`;
            if(data.item_count == 0) {
                document.getElementById('main-cart-footer').classList.add('is-empty');
                document.querySelector('cart-items').classList.add('is-empty');
            }
        });
    }
}
  
customElements.define('cart-remove-button', CartRemoveButton);