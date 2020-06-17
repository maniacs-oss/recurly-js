const assert = require('assert');
const {
  assertIsAToken,
  environment,
  init,
  tokenize
} = require('./support/helpers');

describe('Recurly.js', async () => {

  describe('credit card', async function () {
    beforeEach(init({ fixture: 'hosted-fields-card' }));

    const sel = {
      output: '[data-test=output]',
      form: '[data-test=form]',
      submit: '[data-test=submit]',
      firstName: '[data-test="first-name"]',
      lastName: '[data-test="last-name"]',
      iframe: '.recurly-hosted-field iframe',
      number: 'input[placeholder="Card number"]',
      expiry: 'input[placeholder="MM / YY"]',
      cvv: 'input[placeholder="CVV"]'
    };

    it('injects a hosted field', async function () {
      const iframe = await $(sel.iframe);
      const url = await iframe.getAttribute('src');

      assert.strictEqual(url.substring(0, url.indexOf('#')), `${environment().api}/field.html`);
    });

    it('creates a token', async function () {
      const iframe = await $(sel.iframe);

      await (await $(sel.firstName)).setValue('John');
      await (await $(sel.lastName)).setValue('Rambo');

      await browser.switchToFrame(0);

      const number = await $(sel.number);
      const expiry = await $(sel.expiry);
      const cvv = await $(sel.cvv);

      await number.setValue('4111111111111111');
      await expiry.setValue('1028');
      await cvv.setValue('123');

      assert.strictEqual(await number.getValue(), '4111 1111 1111 1111');
      assert.strictEqual(await expiry.getValue(), '10 / 28');
      assert.strictEqual(await cvv.getValue(), '123');

      await browser.switchToFrame(null);

      const [err, token] = await tokenize(sel.form);

      assert.strictEqual(err, null);
      assertIsAToken(token);
    });
  });

  describe.only('Becs bank account', async function () {
    beforeEach(init({ fixture: 'bank-account-becs' }));

    const sel = {
      output: '[data-test=output]',
      form: '[data-test=form]',
      nameOnAccount: '[data-test="name-on-account"]',
      iframe: '.recurly-hosted-field iframe',
      accountNumber: 'input[data-test="account-number"]',
      accountNumberConfirmation: 'input[data-test="account-number-confirmation"]',
      branchCode: 'input[data-test="branch-code"]',
    };

    it('creates a token', async function () {
      const iframe = await $(sel.iframe);

      await (await $(sel.nameOnAccount)).setValue('John Smith, OBE');

      const accountNumber = await $(sel.accountNumber);
      const accountNumberConfirmation = await $(sel.accountNumberConfirmation);
      const branchCode = await $(sel.branchCode);

      await accountNumber.setValue('012345678');
      await accountNumberConfirmation.setValue('012345678');
      await branchCode.setValue('200-000');

      assert.strictEqual(await accountNumber.getValue(), '012345678');
      assert.strictEqual(await accountNumberConfirmation.getValue(), '012345678');
      assert.strictEqual(await branchCode.getValue(), '200-000');

      const [err, token] = await browser.executeAsync(function (sel, done) {
        recurly.bankAccount.token(document.querySelector(sel.form), function (err, token) {
          done([err, token]);
        });
      }, sel);

      assert.strictEqual(err, null);
      assertIsAToken(token, expectedType="becs_bank_account");
    });
  });
});
