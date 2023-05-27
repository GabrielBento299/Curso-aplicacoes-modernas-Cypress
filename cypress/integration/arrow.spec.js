/// <reference types="cypress" />

it('Equality', () => {
    const a = 7;

    expect(a).to.equal(7);
    expect(a, `Deveria ser ${a}`).to.equal(7);

    expect(a).to.be.equal(7);
});