export default function bankAccount() {
  const formEl = document.querySelector('form');

  if (!formEl) return;

  window.recurly.bankAccount.token(formEl, (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });

  window.recurly.bankAccount.token(formEl, (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });

  // $ExpectError
  window.recurly.bankAccount.token(document.querySelector('div'), (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });

  // $ExpectError
  window.recurly.bankAccount.token('selector', (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });

  const minimalBecsBillingInfo = {
    type: "becs",
    account_number: "1234",
    account_number_confirmation: "1234",
    branch_code: "1234",
    nameOnAccount: "1234",
  };

  window.recurly.bankAccount.token(minimalBecsBillingInfo, (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });

  const addressBecsBillingInfo = {
    type: "becs",
    account_number: "1234",
    account_number_confirmation: "1234",
    branch_code: "1234",
    address1: "asdf",
    address2: "asdf",
    city: "asdf",
    state: "asdf",
    postal_code: "asdf",
    country: "asdf",
    vat_number: "asdf"
  };

  window.recurly.bankAccount.token(addressBecsBillingInfo, (err, token) => {
    if (err) {
      err.message;
      err.code;
    } else {
      token.id;
      token.type;
    }
  });
}
