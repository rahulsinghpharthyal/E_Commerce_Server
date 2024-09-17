import paypal from 'paypal-rest-sdk';

paypal.configure({
    mode: 'sandbox',
    client_id: 'AV75_XbeqoKye1S3o47ZFHGZXGTGu8K0v444dv7CWkR84A6KnIoY5RZOnfw22q1WjTnGOoJVK3tsA0pZ',
    client_secret: 'EJweVoBqPkiZKMcs3mGXsVQA_SAukc7Ey9fcc6HuKIzX0_ChbUmY73GH0vMajvqIxZzWt8MkW4sKQR6s',
})

export default paypal;