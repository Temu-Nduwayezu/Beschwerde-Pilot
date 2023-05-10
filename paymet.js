<script>
  var stripe = Stripe('YOUR_PUBLISHABLE_KEY');
  var elements = stripe.elements();

  var card = elements.create('card', {
    style: {
      base: {
        fontSize: '16px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        color: '#555',
        '::placeholder': {
          color: '#777',
        },
      },
    }
  });

  card.mount('#card-element');

  var form = document.getElementById('payment-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
      } else {
        var amount = document.getElementById('amount').value;
        var token = result.token.id;

        fetch('/charge', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: amount,
            token: token
          })
        })
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          if (data.success) {
            alert('Payment successful!');
          } else {
            alert('Payment failed.');
          }
        });
      }
    });
  });
</script>
