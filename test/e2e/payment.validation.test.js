const assert = require('assert');
const {
  assertIsAToken,
  environment,
  init
} = require('./support/helpers');

const SEL_ACH = {
  output: '[data-test=output]',
  form: '[data-test=form]',
  nameOnAccount: '[data-test="name-on-account"]',
  routingNumber: 'input[data-test="routing-number"]',
  accountNumber: 'input[data-test="account-number"]',
  accountNumberConfirmation: 'input[data-test="account-number-confirmation"]',
  accountType: 'input[data-test="account_type"]',
  country: 'input[data-test="country"]'
};

describe('recurly.bankAccount payment validation tests', async () => {
  describe('When it is a bank-account-ach', async function () {
    beforeEach(init({ fixture: 'bank-account-ach' }));

    it('gets token succesfully', async function () {
      await (await $(SEL_ACH.nameOnAccount)).setValue('John Rambo, OBE');

      const routingNumber = await $(SEL_ACH.routingNumber);
      const accountNumber = await $(SEL_ACH.accountNumber);
      const accountNumberConfirmation = await $(SEL_ACH.accountNumberConfirmation);
      const accountType = await $(SEL_ACH.accountType);
      const country = await $(SEL_ACH.country);

      await routingNumber.setValue('123456780');
      await accountNumber.setValue('111111111');
      await accountNumberConfirmation.setValue('111111111');
      await accountType.setValue('checking');
      await country.setValue('US');

      assert.strictEqual(await accountNumber.getValue(), '111111111');
      assert.strictEqual(await accountNumberConfirmation.getValue(), '111111111');

      const [err, token] = await tokenizeBankAccount(SEL_ACH)

      assert.strictEqual(err, null);
      assertIsAToken(token, 'bank_account')
    });

    it('missing routing number', async function () {
      await (await $(SEL_ACH.nameOnAccount)).setValue('John Rambo, OBE');

      const accountNumber = await $(SEL_ACH.accountNumber);
      const accountNumberConfirmation = await $(SEL_ACH.accountNumberConfirmation);
      const accountType = await $(SEL_ACH.accountType);
      const country = await $(SEL_ACH.country);

      await accountNumber.setValue('111111111');
      await accountNumberConfirmation.setValue('111111111');
      await accountType.setValue('checking');
      await country.setValue('US');

      assert.strictEqual(await accountNumber.getValue(), '111111111');
      assert.strictEqual(await accountNumberConfirmation.getValue(), '111111111');

      const [err, token] = await tokenizeBankAccount(SEL_ACH)

      assert.strictEqual(err.message, 'There was an error validating your request.');
      assert.strictEqual(err.fields[0], 'routing_number');
      assert.strictEqual(err.fields.length, 1);
      assert.strictEqual(token, null);

    });
  });
});

async function tokenizeBankAccount (sel) {
  return await browser.executeAsync(function (sel, done) {
    recurly.bankAccount.token(document.querySelector(sel.form), function (err, token) {
      done([err, token]);
    });
  }, sel);
}